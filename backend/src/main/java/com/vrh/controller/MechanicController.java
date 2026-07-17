package com.vrh.controller;

import com.vrh.dto.ApiResponse;
import com.vrh.dto.MechanicRequest;
import com.vrh.dto.MechanicResponse;
import com.vrh.security.CustomUserDetails;
import com.vrh.service.MechanicService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MechanicController {

    private final MechanicService mechanicService;

    public MechanicController(MechanicService mechanicService) {
        this.mechanicService = mechanicService;
    }

    @PostMapping("/api/owner/mechanics")
    public ResponseEntity<ApiResponse<MechanicResponse>> addMechanic(
            @Valid @RequestBody MechanicRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        MechanicResponse mechanic = mechanicService.addMechanic(request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Mechanic added successfully.", mechanic));
    }

    @GetMapping("/api/owner/mechanics/my-shop")
    public ResponseEntity<ApiResponse<List<MechanicResponse>>> getMyShopMechanics(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        List<MechanicResponse> mechanics = mechanicService.getMechanicsByShop(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(mechanics));
    }

    @GetMapping("/api/owner/shops/{shopId}/mechanics/available")
    public ResponseEntity<ApiResponse<List<MechanicResponse>>> getAvailableMechanics(@PathVariable Long shopId) {
        List<MechanicResponse> mechanics = mechanicService.getAvailableMechanicsByShop(shopId);
        return ResponseEntity.ok(ApiResponse.success(mechanics));
    }
}
