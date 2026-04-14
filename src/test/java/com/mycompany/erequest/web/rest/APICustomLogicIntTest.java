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

    private static final List<TestDetail> testDetails = new ArrayList<>();

    private static class TestDetail {
        String endpoint;
        String scenario;
        String statusIcon;
        String resultType;
        String note;
        String curl;
        String response;
        int httpStatus;

        public TestDetail(String endpoint, String scenario, String statusIcon, String resultType, String note, String curl, String response, int httpStatus) {
            this.endpoint = endpoint;
            this.scenario = scenario;
            this.statusIcon = statusIcon;
            this.resultType = resultType;
            this.note = note;
            this.curl = curl;
            this.response = response;
            this.httpStatus = httpStatus;
        }

        @Override
        public String toString() {
            return String.format("| %s | %s | %s %s | <details><summary>Xem chi tiết</summary> **cUrl:**<br>`%s`<br><br>**Status Code:** %d<br>**Response:**<br>`%s` </details> |", 
                endpoint, scenario, statusIcon, resultType, curl, httpStatus, response);
        }
    }

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

    private String toCurl(String method, String url, String body) {
        StringBuilder curl = new StringBuilder("curl -X ").append(method).append(" '").append(url).append("'");
        curl.append(" -H 'Content-Type: application/json'");
        if (body != null && !body.isEmpty()) {
            curl.append(" -d '").append(body.replace("'", "\\'")).append("'");
        }
        return curl.toString();
    }

    private MvcResult performAndLog(String method, String url, String body, String scenario, String expectedNote) throws Exception {
        System.out.println("\n--------------------------------------------------");
        System.out.println("Running Test: " + scenario);
        String curl = toCurl(method, url, body);
        System.out.println("Command: " + curl);

        MvcResult result;
        if ("POST".equalsIgnoreCase(method)) {
            result = mockMvc.perform(post(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body != null ? body : ""))
                .andReturn();
        } else {
            result = mockMvc.perform(get(url))
                .andReturn();
        }

        int status = result.getResponse().getStatus();
        String response = result.getResponse().getContentAsString();
        
        System.out.println("HTTP Status: " + status);
        System.out.println("Response: " + response);

        boolean isSuccess = status >= 200 && status < 300;
        String statusIcon = isSuccess ? "🟢" : (status == 400 ? "🔴" : "🟡");
        String resultType = isSuccess ? "Hoạt động tốt" : (status == 400 ? "Lỗi Đầu Vào" : "Lỗi Logic");

        testDetails.add(new TestDetail(
            "`" + method + " " + url + "`",
            scenario,
            statusIcon,
            resultType,
            expectedNote,
            curl,
            response.isEmpty() ? "(Empty)" : response,
            status
        ));

        return result;
    }

    @Test
    void testSubmitTicket_ThanhCong_DungOutput() throws Exception {
        String payload = "{\"ticketId\": 1, \"formData\": {\"reason\": \"vacation\"}, \"version\": 1}";
        MvcResult result = performAndLog("POST", "/api/request/ticket/1/submit", payload, 
            "Gửi Form đầy đủ theo cấu trúc", "Đúng Input -> Đúng cấu trúc Output");
        
        String response = result.getResponse().getContentAsString();
        if (!response.contains("\"status\":\"SUCCESS\"")) {
            // Update last detail if logic check fails even if HTTP 200
            TestDetail last = testDetails.get(testDetails.size() - 1);
            last.statusIcon = "🔴";
            last.resultType = "Lỗi Logic";
            last.note = "Sai cấu trúc Output (Thiếu SUCCESS)";
        }
    }

    @Test
    void testSubmitTicket_ThanhCong_SaiOutput() throws Exception {
        // Cố tình ép mock trả về node_type không ai nhận dạng được, giả lập lỗi logic hệ thống
        Mockito.when(eFlowClient.getNodeConfig(Mockito.anyLong())).thenReturn(
            new EFlowClient.NodeConfigDTO(105L, "UNKNOWN_NODE_TYPE", 5001L, null, null, "", "manager@vnu.uet")
        );

        String payload = "{\"ticketId\": 2, \"formData\": {\"reason\": \"sick leave\"}, \"version\": 1}";
        MvcResult result = performAndLog("POST", "/api/request/ticket/2/submit", payload,
            "Gửi Form thành công nhưng Node bị sai", "Đúng Input -> Sai Output (eFlow cấu hình sai NodeType)");

        String response = result.getResponse().getContentAsString();
        if (!response.contains("UNKNOWN_NODE_TYPE")) {
             TestDetail last = testDetails.get(testDetails.size() - 1);
             last.statusIcon = "🟢"; // Tình huống này nếu không thấy UNKNOWN thì lại là đúng? 
             // Giữ nguyên logic cũ: Nếu có UNKNOWN_NODE_TYPE thì coi như Lỗi Logic từ eFlow Client (status 🟢 nhưng nội dung là lỗi)
        }
    }

    @Test
    void testSubmitTicket_LoiInput_BadRequest() throws Exception {
        // Payload sai kiểu dữ liệu
        String payload = "{\"ticketId\": \"KHONG_PHAI_SO\", \"formData\": {}, \"version\": \"A\"}";
        performAndLog("POST", "/api/request/ticket/3/submit", payload,
            "Gửi sai định dạng Params", "Input không hợp lệ, hệ thống trả về 400 Bad Request");
    }

    @Test
    void testInitTicket_ThanhCong() throws Exception {
        performAndLog("POST", "/api/request/ticket/init", null,
            "Tạo giao dịch mới", "Tạo Ticket Draft thành công");
    }

    @Test
    void testGetWorkflows_ThanhCong() throws Exception {
        performAndLog("GET", "/api/request/workflows", null,
            "Lấy danh sách quy trình", "Lấy dữ liệu Workflow thành công");
    }

    @Test
    void testSubmitTicket_LoiConflictVersion_409() throws Exception {
        // Gửi payload version = 0, kỳ vọng backend sẽ quét DB thấy version hiện tại > 0 và ném lỗi (409 Conflict hoặc 400)
        String payload = "{\"ticketId\": 1, \"formData\": {\"reason\": \"vacation\"}, \"version\": 0}";
        MvcResult result = performAndLog("POST", "/api/request/ticket/1/submit", payload,
            "Optimistic Locking: Submit với version cũ", "Kỳ vọng lỗi 409 Conflict hoặc 400 do sai version");

        int status = result.getResponse().getStatus();
        if (status == 200) {
            TestDetail last = testDetails.get(testDetails.size() - 1);
            last.statusIcon = "🔴";
            last.resultType = "Chưa cài đặt logic";
            last.note = "Backend vẫn trả về 200 OK thay vì từ chối giao dịch do xung đột version";
        }
    }

    @Test
    void testSubmitTicket_BranchingLogic() throws Exception {
        // Giả lập flow config quy định if amount > 1000 thì rẽ nhánh
        Mockito.when(eFlowClient.getNodeConfig(Mockito.anyLong())).thenReturn(
            new EFlowClient.NodeConfigDTO(106L, "user_task", 5001L, null, null, "amount > 1000", "manager@vnu.uet")
        );

        String payload = "{\"ticketId\": 4, \"formData\": {\"amount\": 2000}, \"version\": 1}";
        performAndLog("POST", "/api/request/ticket/4/submit", payload,
            "Rẽ nhánh (Branching): Thỏa mãn điều kiện (amount > 1000)", "Kỳ vọng ứng dụng đánh giá đúng relate_demand để chuyển bước");
    }

    @Test
    void testSubmitTicket_InactiveUserFallback() throws Exception {
        // Giả lập chuyển bước cho một user đang bị Inactive
        String payload = "{\"ticketId\": 5, \"formData\": {\"reason\": \"sick\"}, \"version\": 1}";
        MvcResult result = performAndLog("POST", "/api/request/ticket/5/submit", payload,
            "Xác thực người xử lý: Tài khoản bị inactive", "Kỳ vọng chuyển fallback lên cho superviser_name");

        String response = result.getResponse().getContentAsString();
        if (!response.contains("superviser")) {
            TestDetail last = testDetails.get(testDetails.size() - 1);
            last.statusIcon = "🟡";
            last.resultType = "Chưa cài đặt logic";
            last.note = "Chưa thấy logic fallback sang supervisor khi user inactive";
        }
    }

    @Test
    void testTicketAction_Cancel() throws Exception {
        String payload = "{\"action\": \"CANCEL\", \"reason\": \"Sai sót\"}";
        performAndLog("POST", "/api/request/ticket/1/action", payload,
            "Action API: Hủy giao dịch", "Kỳ vọng trạng thái ticket chuyển sang 3 (Hủy)");
    }

    @Test
    void testTicketAction_Reject() throws Exception {
        String payload = "{\"action\": \"REJECT\", \"reason\": \"Không hợp lệ\"}";
        performAndLog("POST", "/api/request/ticket/1/action", payload,
            "Action API: Từ chối duyệt", "Kỳ vọng trạng thái step chuyển sang 2 (Từ chối)");
    }

    @Test
    void testGetMyRequests_HasJoinedData() throws Exception {
        MvcResult result = performAndLog("GET", "/api/request/tickets/my-requests", null,
            "Dữ liệu danh sách hợp nhất (Tránh N+1)", "Kỳ vọng có trả về flowName và currentNodeName");

        String response = result.getResponse().getContentAsString();
        if (!response.contains("flowName") || !response.contains("currentNodeName")) {
             TestDetail last = testDetails.get(testDetails.size() - 1);
             last.statusIcon = "🔴";
             last.resultType = "Lỗi Output";
             last.note = "Thiếu thông tin flowName hoặc currentNodeName trong response";
        }
    }


    @AfterAll
    static void generateReport() {
        try {
            Path path = Paths.get("target/api-test-results.md");
            Files.createDirectories(path.getParent());
            
            StringBuilder md = new StringBuilder();
            md.append("| Endpoint API | Kịch Bản (Scenario) | Trạng Thái | Chi Tiết Diagnostic |\n");
            md.append("| --- | --- | --- | --- |\n");
            for (TestDetail detail : testDetails) {
                md.append(detail.toString()).append("\n");
            }

            Files.writeString(path, md.toString(), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            System.out.println("✅ Đã tạo bảng kết quả tại: " + path.toAbsolutePath());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
