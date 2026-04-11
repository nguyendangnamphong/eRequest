package com.mycompany.erequest.web.rest;

import com.mycompany.erequest.client.EAccountClient;
import com.mycompany.erequest.client.EFormClient;
import com.mycompany.erequest.client.EFlowClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/request")
public class ERequestCustomResource {

    private final EAccountClient eAccountClient;
    private final EFormClient eFormClient;
    private final EFlowClient eFlowClient;

    public ERequestCustomResource(EAccountClient eAccountClient, EFormClient eFormClient, EFlowClient eFlowClient) {
        this.eAccountClient = eAccountClient;
        this.eFormClient = eFormClient;
        this.eFlowClient = eFlowClient;
    }

    @GetMapping("/workflows")
    public ResponseEntity<?> getWorkflows() {
        return ResponseEntity.ok(List.of(Map.of("flowId", 5001, "name", "Nghỉ Phép")));
    }

    @PostMapping("/ticket/init")
    public ResponseEntity<?> initTicket() {
        return ResponseEntity.ok(Map.of("ticketId", 1, "status", "Draft"));
    }

    @GetMapping("/ticket/related-options")
    public ResponseEntity<?> getRelatedOptions() {
        return ResponseEntity.ok(List.of(Map.of("ticketId", 99, "name", "Giao dịch cũ 99")));
    }

    @GetMapping("/tickets/my-requests")
    public ResponseEntity<?> getMyRequests() {
        return ResponseEntity.ok(Map.of("content", List.of(Map.of("ticketId", 1, "flowName", "Nghỉ phép", "currentNodeName", "Trưởng phòng duyệt")), "totalElements", 1));
    }

    @GetMapping("/tickets/pending-tasks")
    public ResponseEntity<?> getPendingTasks() {
        return ResponseEntity.ok(Map.of("content", List.of(), "totalElements", 0));
    }

    @PostMapping("/ticket/export")
    public ResponseEntity<?> exportTickets() {
        return ResponseEntity.ok(Map.of("message", "Export triggered"));
    }

    @GetMapping("/ticket/{ticketId}/detail")
    public ResponseEntity<?> getTicketDetail(@PathVariable("ticketId") Long ticketId) {
        return ResponseEntity.ok(Map.of("ticketId", ticketId, "status", 1));
    }

    @GetMapping("/ticket/{ticketId}/step-config")
    public ResponseEntity<?> getStepConfig(@PathVariable("ticketId") Long ticketId) {
        // Mock calls eFlow for config
        var nodeConfig = eFlowClient.getNodeConfig(105L);
        return ResponseEntity.ok(nodeConfig);
    }

    @PostMapping("/ticket/{ticketId}/submit")
    public ResponseEntity<?> submitTicket(@PathVariable("ticketId") Long ticketId, @RequestBody SubmitRequestDTO dto) {
        // Logic: calls eForm, then flow
        eFormClient.saveFormData(new EFormClient.FormRecordRequestDTO("F_001", dto.formData()));
        var nodeConfig = eFlowClient.getNodeConfig(105L); // Mock node next
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "Ticket submitted and moved to " + nodeConfig.nodeType()));
    }

    @PostMapping("/ticket/{ticketId}/action")
    public ResponseEntity<?> takeAction(@PathVariable("ticketId") Long ticketId, @RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(Map.of("status", "Action taken"));
    }

    @GetMapping("/ticket/{ticketId}/history")
    public ResponseEntity<?> getHistory(@PathVariable("ticketId") Long ticketId) {
        return ResponseEntity.ok(List.of(Map.of("stepId", 1, "performerEmail", "user@vnu.uet", "status", 1)));
    }

    @GetMapping("/ticket/{ticketId}/sla")
    public ResponseEntity<?> getSla(@PathVariable("ticketId") Long ticketId) {
        return ResponseEntity.ok(Map.of("remindAt", "2026-10-15T00:00:00Z"));
    }

    @GetMapping("/ticket/{ticketId}/related")
    public ResponseEntity<?> getRelated(@PathVariable("ticketId") Long ticketId) {
        return ResponseEntity.ok(List.of(Map.of("relatedTicketId", 99)));
    }

    @PostMapping("/ticket/{ticketId}/comment")
    public ResponseEntity<?> addComment(@PathVariable("ticketId") Long ticketId, @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(Map.of("status", "Comment added"));
    }

    @PostMapping("/ai/create-from-pdf")
    public ResponseEntity<?> createFromPdf(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(Map.of("ticketId", 100));
    }

    @GetMapping("/ai/verify-data")
    public ResponseEntity<?> verifyAiData() {
        return ResponseEntity.ok(Map.of("formData", Map.of("reason", "PDF extracted reason")));
    }

    public record SubmitRequestDTO(Long ticketId, Object formData, Integer version) {}
}
