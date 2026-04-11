package com.mycompany.erequest.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "eFlowClient", url = "${application.client.eflow.url:http://localhost:8083}")
public interface EFlowClient {

    @GetMapping("/api/workflow/node/{nodeId}/config")
    NodeConfigDTO getNodeConfig(@PathVariable("nodeId") Long nodeId);

    record NodeConfigDTO(Long nodeId, String nodeType, Long flowId, PerformerDTO performer, MapFormDTO mapForm, String relateDemand, String superviserName) {}
    record PerformerDTO(Long userId, String email, Integer orderExecution) {}
    record MapFormDTO(String targetFormId, String sourceFormId) {}
}
