package com.mycompany.erequest.web.rest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.mycompany.erequest.IntegrationTest;
import com.mycompany.erequest.client.EFormClient;
import com.mycompany.erequest.client.EFlowClient;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.List;

import org.mockito.Mockito;
import static org.mockito.ArgumentMatchers.any;

import org.springframework.security.test.context.support.WithMockUser;

@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class APICustomLogicIntTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EFormClient eFormClient;

    @MockBean
    private EFlowClient eFlowClient;

    private static final List<String> testResults = new ArrayList<>();

    @BeforeEach
    void setup() {
        // Init mocks
        Mockito.when(eFlowClient.getNodeConfig(Mockito.anyLong())).thenReturn(
            new EFlowClient.NodeConfigDTO(105L, "user_task", 5001L, null, null, "vondieule > 1000", "manager@vnu.uet")
        );
        Mockito.when(eFormClient.saveFormData(any())).thenReturn(
            new EFormClient.FormRecordResponseDTO("DATA001", "SUCCESS")
        );
    }

    @Test
    void testSubmitTicket_ThanhCong_DungOutput() throws Exception {
        String payload = "{\"ticketId\": 1, \"formData\": {\"reason\": \"vacation\"}, \"version\": 1}";
        MvcResult result = mockMvc.perform(post("/api/request/ticket/1/submit")
            .contentType(MediaType.APPLICATION_JSON)
            .content(payload))
            .andExpect(status().isOk())
            .andReturn();
        
        String response = result.getResponse().getContentAsString();
        if (response.contains("\"status\":\"SUCCESS\"")) {
            testResults.add("| `POST /api/request/ticket/{id}/submit` | Gửi Form đầy đủ theo cấu trúc | 🟢 Hoạt động tốt | Đúng Input -> Đúng cấu trúc Output |");
        } else {
            testResults.add("| `POST /api/request/ticket/{id}/submit` | Gửi Form đầy đủ theo cấu trúc | 🔴 Lỗi Logic | Sai cấu trúc Output |");
        }
    }

    @Test
    void testSubmitTicket_ThanhCong_SaiOutput() throws Exception {
        // Cố tình ép mock trả về node_type không ai nhận dạng được, giả lập lỗi logic hệ thống
        Mockito.when(eFlowClient.getNodeConfig(Mockito.anyLong())).thenReturn(
            new EFlowClient.NodeConfigDTO(105L, "UNKNOWN_NODE_TYPE", 5001L, null, null, "", "manager@vnu.uet")
        );

        String payload = "{\"ticketId\": 2, \"formData\": {\"reason\": \"sick leave\"}, \"version\": 1}";
        MvcResult result = mockMvc.perform(post("/api/request/ticket/2/submit")
            .contentType(MediaType.APPLICATION_JSON)
            .content(payload))
            .andExpect(status().isOk())
            .andReturn();

        String response = result.getResponse().getContentAsString();
        // Kiểm tra xem Output có chứa UNKNOWN_NODE_TYPE không, nếu có coi như Lỗi Logic từ eFlow Client
        if (response.contains("UNKNOWN_NODE_TYPE")) {
            testResults.add("| `POST /api/request/ticket/{id}/submit` | Gửi Form thành công nhưng Node bị sai | 🟡 Lỗi Logic | Đúng Input -> Sai Output (eFlow cấu hình sai NodeType) |");
        }
    }

    @Test
    void testSubmitTicket_LoiInput_BadRequest() throws Exception {
        // Payload sai kiểu dữ liệu
        String payload = "{\"ticketId\": \"KHONG_PHAI_SO\", \"formData\": {}, \"version\": \"A\"}";
        mockMvc.perform(post("/api/request/ticket/3/submit")
            .contentType(MediaType.APPLICATION_JSON)
            .content(payload))
            .andExpect(status().isBadRequest()); // 400 Bad Request

        testResults.add("| `POST /api/request/ticket/{id}/submit` | Gửi sai định dạng Params | 🔴 Lỗi Đầu Vào | Input không hợp lệ, hệ thống trả về 400 Bad Request |");
    }

    @Test
    void testInitTicket_ThanhCong() throws Exception {
        mockMvc.perform(post("/api/request/ticket/init"))
            .andExpect(status().isOk());
        testResults.add("| `POST /api/request/ticket/init` | Tạo giao dịch mới | 🟢 Hoạt động tốt | Tạo Ticket Draft thành công |");
    }

    @Test
    void testGetWorkflows_ThanhCong() throws Exception {
        mockMvc.perform(get("/api/request/workflows"))
            .andExpect(status().isOk());
        testResults.add("| `GET /api/request/workflows` | Lấy danh sách quy trình | 🟢 Hoạt động tốt | Lấy dữ liệu Workflow thành công |");
    }

    @AfterAll
    static void generateReport() {
        try {
            Path path = Paths.get("target/api-test-results.md");
            Files.createDirectories(path.getParent());
            
            StringBuilder md = new StringBuilder();
            md.append("## BẢNG KẾT QUẢ KIỂM THỬ LOGIC API\n\n");
            md.append("| Endpoint API | Kịch Bản (Scenario) | Trạng Thái | Ghi Chú |\n");
            md.append("| --- | --- | --- | --- |\n");
            for (String res : testResults) {
                md.append(res).append("\n");
            }

            Files.writeString(path, md.toString(), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            System.out.println("✅ Đã tạo bảng kết quả tại: " + path.toAbsolutePath());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
