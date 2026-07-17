package com.vrh.controller;

import com.vrh.dto.ApiResponse;
import com.vrh.dto.VehicleRequest;
import com.vrh.dto.VehicleResponse;
import com.vrh.security.CustomUserDetails;
import com.vrh.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping("/api/customer/vehicles")
    public ResponseEntity<ApiResponse<VehicleResponse>> addVehicle(
            @Valid @RequestBody VehicleRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        VehicleResponse response = vehicleService.addVehicle(request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Vehicle registered successfully", response));
    }

    @GetMapping("/api/customer/vehicles/my")
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> getMyVehicles(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        List<VehicleResponse> vehicles = vehicleService.getVehiclesByCustomer(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(vehicles));
    }
}
