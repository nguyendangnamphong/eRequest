package com.mycompany.erequest.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "eAccountClient", url = "${application.client.eaccount.url:http://localhost:8081}")
public interface EAccountClient {

    @GetMapping("/api/account/profile")
    AccountProfileDTO getProfile(@RequestHeader("Authorization") String token);

    @PostMapping("/api/internal/permissions/check-access")
    AccessCheckResponseDTO checkAccess(@RequestBody AccessCheckRequestDTO request);

    record AccountProfileDTO(String email, String firstName, String phone, String dob, String gender, String position, String job, String department, String avatar, java.util.List<Integer> roles) {}
    record AccessCheckRequestDTO(String email, Integer requiredRole) {}
    record AccessCheckResponseDTO(Boolean hasAccess) {}
}
