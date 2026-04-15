package com.mycompany.erequest.web.rest;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.mycompany.erequest.IntegrationTest;
import com.mycompany.erequest.client.EFlowClient;
import com.mycompany.erequest.client.EFormClient;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

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

    @Autowired
    private ObjectMapper objectMapper;

    private static final List<TestDetail> testDetails = new ArrayList<>();

    private static class TestDetail {

        String endpoint;
        String scenario;
        String statusIcon;
        String resultType;
        String expected;
        String actual;
        String curl;
        String response;
        int httpStatus;

        public TestDetail(
            String endpoint,
            String scenario,
            String statusIcon,
            String resultType,
            String expected,
            String actual,
            String curl,
            String response,
            int httpStatus
        ) {
            this.endpoint = endpoint;
            this.scenario = scenario;
            this.statusIcon = statusIcon;
            this.resultType = resultType;
            this.expected = expected;
            this.actual = actual;
            this.curl = curl;
            this.response = response;
            this.httpStatus = httpStatus;
        }
    }

    @BeforeEach
    void setup() {
        // Init mocks
        Mockito.when(eFlowClient.getNodeConfig(Mockito.anyLong())).thenReturn(
            new EFlowClient.NodeConfigDTO(105L, "user_task", 5001L, null, null, "vondieule > 1000", "manager@vnu.uet")
        );
        Mockito.when(eFormClient.saveFormData(any())).thenReturn(new EFormClient.FormRecordResponseDTO("DATA001", "SUCCESS"));
    }

    private String toCurl(String method, String url, String body) {
        StringBuilder curl = new StringBuilder("curl -X ").append(method).append(" '").append(url).append("'");
        curl.append(" -H 'Content-Type: application/json'");
        if (body != null && !body.isEmpty()) {
            curl.append(" -d '").append(body.replace("'", "\\'")).append("'");
        }
        return curl.toString();
    }

    private MvcResult performAndLog(String method, String url, String body, String scenario, String expected) throws Exception {
        System.out.println("\n--------------------------------------------------");
        System.out.println("Running Test: " + scenario);
        String curl = toCurl(method, url, body);
        System.out.println("Command: " + curl);

        MvcResult result;
        if ("POST".equalsIgnoreCase(method)) {
            result = mockMvc.perform(post(url).contentType(MediaType.APPLICATION_JSON).content(body != null ? body : "")).andReturn();
        } else {
            result = mockMvc.perform(get(url)).andReturn();
        }

        int status = result.getResponse().getStatus();
        String responseRaw = result.getResponse().getContentAsString();
        String responsePretty = responseRaw;

        try {
            if (!responseRaw.isEmpty()) {
                Object json = objectMapper.readValue(responseRaw, Object.class);
                responsePretty = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(json);
            }
        } catch (Exception e) {
            // Not a JSON or error in parsing, keep raw
        }

        System.out.println("HTTP Status: " + status);
        System.out.println("Response: " + responsePretty);

        boolean isSuccess = status >= 200 && status < 300;
        String statusIcon = isSuccess ? "🟢" : (status == 409 ? "🟡" : "🔴");
        String resultType = isSuccess ? "Thành Công" : (status == 409 ? "Xung Đột (Conflict)" : "Lỗi Hệ Thống");
        String actual = isSuccess ? "Hệ thống trả về HTTP " + status : "Lỗi HTTP " + status;

        testDetails.add(
            new TestDetail(
                method + " " + url,
                scenario,
                statusIcon,
                resultType,
                expected,
                actual,
                curl,
                responsePretty.isEmpty() ? "(Trống)" : responsePretty,
                status
            )
        );

        return result;
    }

    @Test
    void testSubmitTicket_ThanhCong_DungOutput() throws Exception {
        String payload = "{\"ticketId\": 1, \"formData\": {\"reason\": \"vacation\"}, \"version\": 1}";
        MvcResult result = performAndLog(
            "POST",
            "/api/request/ticket/1/submit",
            payload,
            "Gửi Form đầy đủ theo cấu trúc",
            "Đúng Input -> Đúng cấu trúc Output"
        );

        String response = result.getResponse().getContentAsString();
        if (!response.contains("\"status\":\"SUCCESS\"")) {
            TestDetail last = testDetails.get(testDetails.size() - 1);
            last.statusIcon = "🔴";
            last.resultType = "Lỗi Logic";
            last.actual = "Hệ thống trả về 200 nhưng thiếu 'status:SUCCESS' trong body";
        }
    }

    @Test
    void testSubmitTicket_ThanhCong_SaiOutput() throws Exception {
        Mockito.when(eFlowClient.getNodeConfig(Mockito.anyLong())).thenReturn(
            new EFlowClient.NodeConfigDTO(105L, "UNKNOWN_NODE_TYPE", 5001L, null, null, "", "manager@vnu.uet")
        );

        String payload = "{\"ticketId\": 2, \"formData\": {\"reason\": \"sick leave\"}, \"version\": 1}";
        MvcResult result = performAndLog(
            "POST",
            "/api/request/ticket/2/submit",
            payload,
            "Gửi Form thành công nhưng Node bị sai",
            "Đúng Input -> Sai Output (eFlow cấu hình sai NodeType)"
        );

        String response = result.getResponse().getContentAsString();
        if (!response.contains("UNKNOWN_NODE_TYPE")) {
            TestDetail last = testDetails.get(testDetails.size() - 1);
            last.statusIcon = "🟢"; // Nếu không thấy UNKNOWN_NODE_TYPE thì có thể server đã fix?
        }
    }

    @Test
    void testSubmitTicket_LoiInput_BadRequest() throws Exception {
        String payload = "{\"ticketId\": \"KHONG_PHAI_SO\", \"formData\": {}, \"version\": \"A\"}";
        performAndLog(
            "POST",
            "/api/request/ticket/3/submit",
            payload,
            "Gửi sai định dạng Params",
            "Input không hợp lệ, hệ thống trả về 400 Bad Request"
        );
    }

    @Test
    void testInitTicket_ThanhCong() throws Exception {
        performAndLog("POST", "/api/request/ticket/init", null, "Tạo giao dịch mới", "Tạo Ticket Draft thành công");
    }

    @Test
    void testGetWorkflows_ThanhCong() throws Exception {
        performAndLog("GET", "/api/request/workflows", null, "Lấy danh sách quy trình", "Lấy dữ liệu Workflow thành công");
    }

    @Test
    void testSubmitTicket_LoiConflictVersion_409() throws Exception {
        String payload = "{\"ticketId\": 1, \"formData\": {\"reason\": \"vacation\"}, \"version\": 0}";
        MvcResult result = performAndLog(
            "POST",
            "/api/request/ticket/1/submit",
            payload,
            "Optimistic Locking: Submit với version cũ",
            "Hệ thống phát hiện xung đột và trả về 409 hoặc 400"
        );

        int status = result.getResponse().getStatus();
        if (status == 200) {
            TestDetail last = testDetails.get(testDetails.size() - 1);
            last.statusIcon = "🔴";
            last.resultType = "Lỗi Logic (Versioning)";
            last.actual = "Xung đột version nhưng vẫn trả về 200 OK (Nguy cơ mất dữ liệu)";
        }
    }

    @Test
    void testSubmitTicket_BranchingLogic() throws Exception {
        Mockito.when(eFlowClient.getNodeConfig(Mockito.anyLong())).thenReturn(
            new EFlowClient.NodeConfigDTO(106L, "user_task", 5001L, null, null, "amount > 1000", "manager@vnu.uet")
        );

        String payload = "{\"ticketId\": 4, \"formData\": {\"amount\": 2000}, \"version\": 1}";
        performAndLog(
            "POST",
            "/api/request/ticket/4/submit",
            payload,
            "Rẽ nhánh (Branching): Thỏa mãn điều kiện (amount > 1000)",
            "Chuyển bước chính xác dựa trên relate_demand"
        );
    }

    @Test
    void testSubmitTicket_InactiveUserFallback() throws Exception {
        String payload = "{\"ticketId\": 5, \"formData\": {\"reason\": \"sick\"}, \"version\": 1}";
        MvcResult result = performAndLog(
            "POST",
            "/api/request/ticket/5/submit",
            payload,
            "Xác thực người xử lý: Tài khoản bị inactive",
            "Tự động fallback sang người giám sát (supervisor)"
        );

        String response = result.getResponse().getContentAsString();
        if (!response.contains("superviser")) {
            TestDetail last = testDetails.get(testDetails.size() - 1);
            last.statusIcon = "🟡";
            last.resultType = "Thiếu Logic";
            last.actual = "Chưa thực hiện fallback sang supervisor khi user inactive";
        }
    }

    @Test
    void testTicketAction_Cancel() throws Exception {
        String payload = "{\"action\": \"CANCEL\", \"reason\": \"Sai sót\"}";
        performAndLog(
            "POST",
            "/api/request/ticket/1/action",
            payload,
            "Action API: Hủy giao dịch",
            "Trạng thái Ticket chuyển sang CANCELED (3)"
        );
    }

    @Test
    void testTicketAction_Reject() throws Exception {
        String payload = "{\"action\": \"REJECT\", \"reason\": \"Không hợp lệ\"}";
        performAndLog(
            "POST",
            "/api/request/ticket/1/action",
            payload,
            "Action API: Từ chối duyệt",
            "Trạng thái Step chuyển sang REJECTED (2)"
        );
    }

    @Test
    void testGetMyRequests_HasJoinedData() throws Exception {
        MvcResult result = performAndLog(
            "GET",
            "/api/request/tickets/my-requests",
            null,
            "Dữ liệu danh sách hợp nhất (Tránh N+1)",
            "Response có đầy đủ flowName và currentNodeName"
        );

        String response = result.getResponse().getContentAsString();
        if (!response.contains("flowName") || !response.contains("currentNodeName")) {
            TestDetail last = testDetails.get(testDetails.size() - 1);
            last.statusIcon = "🔴";
            last.resultType = "Thiếu Dữ Liệu";
            last.actual = "Response thiếu thông tin Join từ eFlow (flowName/currentNodeName)";
        }
    }

    @Test
    void testExportTickets() throws Exception {
        performAndLog("POST", "/api/request/ticket/export", "{}", "Xuất dữ liệu: Export Excel/PDF", "Hệ thống xử lý xuất file thành công");
    }

    @Test
    void testSlaTracking() throws Exception {
        performAndLog(
            "GET",
            "/api/request/ticket/1/sla",
            null,
            "SLA Tracking: Kiểm tra cảnh báo trễ hạn",
            "Trả về thời gian nhắc nhở (remindAt) hợp lệ"
        );
    }

    @Test
    void testAddComment() throws Exception {
        String payload = "{\"content\": \"Cần bổ sung tài liệu\"}";
        performAndLog("POST", "/api/request/ticket/1/comment", payload, "Tương tác: Thêm bình luận", "Lưu bình luận thành công");
    }

    @Test
    void testAiCreateFromPdf() throws Exception {
        String payload = "{\"pdfUrl\": \"s3://bucket/test.pdf\"}";
        performAndLog(
            "POST",
            "/api/request/ai/create-from-pdf",
            payload,
            "Tích hợp AI: Tạo ticket từ file PDF",
            "Trả về ticketId mới tạo từ AI"
        );
    }

    @Test
    void testAiVerifyData() throws Exception {
        performAndLog(
            "GET",
            "/api/request/ai/verify-data",
            null,
            "Tích hợp AI: Kiểm tra dữ liệu extract",
            "Dữ liệu forms được trích xuất chính xác"
        );
    }

    @Test
    void testTicketRelated() throws Exception {
        performAndLog(
            "GET",
            "/api/request/ticket/1/related",
            null,
            "Liên kết: Danh sách file/ticket liên quan",
            "Trả về danh sách ID các đối tượng liên quan"
        );
    }

    @Test
    void testGetTicketDetail() throws Exception {
        performAndLog(
            "GET",
            "/api/request/ticket/1/detail",
            null,
            "Danh sách giao dịch: Lấy chi tiết ticket",
            "Trả về toàn bộ trạng thái và lịch sử xử lý"
        );
    }

    @Test
    void testGetStepConfig() throws Exception {
        performAndLog(
            "GET",
            "/api/request/ticket/1/step-config",
            null,
            "Tra cứu cấu trúc Node",
            "Trả về cấu hình người phụ trách và ánh xạ biểu mẫu"
        );
    }

    @AfterAll
    static void generateReport() {
        try {
            Path path = Paths.get("target/api-test-results.md");
            Files.createDirectories(path.getParent());

            long total = testDetails.size();
            long success = testDetails.stream().filter(d -> d.statusIcon.equals("🟢")).count();
            long failed = total - success;

            StringBuilder md = new StringBuilder();
            md.append("# 🚀 CHI TIẾT KẾT QUẢ KIỂM THỬ API LOGIC\n\n");

            md.append("## 📊 TỔNG QUAN HỆ THỐNG\n");
            md.append("> [!IMPORTANT]\n");
            md.append(String.format("> - **Tổng số kịch bản:** `%d` \n", total));
            md.append(String.format("> - **Thành công:** 🟢 `%d` \n", success));
            md.append(String.format("> - **Thất bại/Cảnh báo:** 🔴 `%d` \n\n", failed));

            md.append("--- \n\n");

            for (int i = 0; i < testDetails.size(); i++) {
                TestDetail d = testDetails.get(i);
                md.append(String.format("### %d. %s %s\n", i + 1, d.statusIcon, d.scenario));
                md.append(String.format("- **Endpoint:** `%s`\n", d.endpoint));
                md.append(String.format("- **Kết quả:** `%s`\n", d.resultType));
                md.append(String.format("- **Dự đoán:** %s\n", d.expected));
                md.append(String.format("- **Thực tế:** %s\n\n", d.actual));

                md.append("<details><summary><b>🛠 THÔNG TIN CHI TIẾT (DIAGNOSTIC)</b></summary>\n\n");

                md.append("#### 📥 Input (cUrl)\n");
                md.append("```bash\n").append(d.curl).append("\n```\n\n");

                md.append(String.format("#### 📤 Output (Response) - HTTP `%d`\n", d.httpStatus));
                md.append("```json\n").append(d.response).append("\n```\n\n");

                md.append("</details>\n\n");
                md.append("---\n\n");
            }

            Files.writeString(path, md.toString(), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            System.out.println("✅ Report updated at: " + path.toAbsolutePath());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
