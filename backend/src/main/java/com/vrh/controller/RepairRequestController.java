package com.vrh.controller;

import com.vrh.dto.ApiResponse;
import com.vrh.dto.RepairRequestBook;
import com.vrh.dto.RepairRequestResponse;
import com.vrh.entity.enums.RepairStatus;
import com.vrh.security.CustomUserDetails;
import com.vrh.service.RepairRequestService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
public class RepairRequestController {

    private final RepairRequestService repairRequestService;

    public RepairRequestController(RepairRequestService repairRequestService) {
        this.repairRequestService = repairRequestService;
    }

    // ─── Customer Endpoints ─────────────────────────────────

    @PostMapping("/api/customer/repair-requests")
    public ResponseEntity<ApiResponse<RepairRequestResponse>> bookRepair(
            @Valid @RequestBody RepairRequestBook request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        RepairRequestResponse response = repairRequestService.bookRepair(request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Repair request created successfully.", response));
    }

    @GetMapping("/api/customer/repair-requests/my")
    public ResponseEntity<ApiResponse<Page<RepairRequestResponse>>> getMyRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Page<RepairRequestResponse> requests = repairRequestService.getCustomerRequests(userDetails.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.success(requests));
    }

    // ─── Owner Endpoints ────────────────────────────────────

    @GetMapping("/api/owner/repair-requests/my-shop")
    public ResponseEntity<ApiResponse<Page<RepairRequestResponse>>> getMyShopRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Page<RepairRequestResponse> requests = repairRequestService.getShopRequests(userDetails.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.success(requests));
    }

    @PutMapping("/api/owner/repair-requests/{id}/assign")
    public ResponseEntity<ApiResponse<RepairRequestResponse>> assignMechanic(
            @PathVariable Long id,
            @RequestParam Long mechanicId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        RepairRequestResponse response = repairRequestService.assignMechanic(id, mechanicId, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Mechanic assigned successfully and status updated to ACCEPTED.", response));
    }

    // ─── Mechanic Endpoints ─────────────────────────────────

    @GetMapping("/api/mechanic/repair-requests/my-jobs")
    public ResponseEntity<ApiResponse<Page<RepairRequestResponse>>> getMyJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Page<RepairRequestResponse> jobs = repairRequestService.getMechanicRequests(userDetails.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.success(jobs));
    }

    @PutMapping("/api/mechanic/repair-requests/{id}/status")
    public ResponseEntity<ApiResponse<RepairRequestResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam RepairStatus status,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        RepairRequestResponse response = repairRequestService.updateStatus(id, status, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Job status updated successfully to " + status, response));
    }
}
