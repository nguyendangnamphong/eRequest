package com.mycompany.erequest.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "eFormClient", url = "${application.client.eform.url:http://localhost:8082}")
public interface EFormClient {

    @GetMapping("/api/owner/form")
    FormMetadataDTO getFormById(@RequestParam("formId") String formId);
    
    @PostMapping("/api/owner/form-data")
    FormRecordResponseDTO saveFormData(@RequestBody FormRecordRequestDTO request);

    record FormMetadataDTO(String formId, String formName, String jsonForm, java.util.List<VariableDTO> variableArr, Integer statusForm) {}
    record VariableDTO(String code, String variableName, String variableType) {}
    record FormRecordRequestDTO(String formId, Object formData) {}
    record FormRecordResponseDTO(String dataId, String status) {}
}
