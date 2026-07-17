package com.vrh.controller;

import com.vrh.dto.ApiResponse;
import com.vrh.dto.ServiceTypeRequest;
import com.vrh.entity.ServiceType;
import com.vrh.service.ServiceTypeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ServiceTypeController {

    private final ServiceTypeService serviceTypeService;

    public ServiceTypeController(ServiceTypeService serviceTypeService) {
        this.serviceTypeService = serviceTypeService;
    }

    @GetMapping("/api/service-types")
    public ResponseEntity<ApiResponse<List<ServiceType>>> getAllServiceTypes() {
        List<ServiceType> services = serviceTypeService.getAllServiceTypes();
        return ResponseEntity.ok(ApiResponse.success(services));
    }

    @PostMapping("/api/admin/service-types")
    public ResponseEntity<ApiResponse<ServiceType>> createServiceType(@Valid @RequestBody ServiceTypeRequest request) {
        ServiceType service = serviceTypeService.createServiceType(request);
        return ResponseEntity.ok(ApiResponse.success("Service type created successfully", service));
    }
}
