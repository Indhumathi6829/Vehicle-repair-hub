package com.vrh.controller;

import com.vrh.dto.ApiResponse;
import com.vrh.dto.ShopRequest;
import com.vrh.dto.ShopResponse;
import com.vrh.security.CustomUserDetails;
import com.vrh.service.ShopService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ShopController {

    private final ShopService shopService;

    public ShopController(ShopService shopService) {
        this.shopService = shopService;
    }

    // ─── Public Endpoints ────────────────────────────────────

    @GetMapping("/api/shops")
    public ResponseEntity<ApiResponse<Page<ShopResponse>>> getApprovedShops(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Long serviceTypeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<ShopResponse> shops = shopService.getApprovedShops(city, serviceTypeId, page, size);
        return ResponseEntity.ok(ApiResponse.success(shops));
    }

    @GetMapping("/api/shops/{id}")
    public ResponseEntity<ApiResponse<ShopResponse>> getShopById(@PathVariable Long id) {
        ShopResponse shop = shopService.getShopById(id);
        return ResponseEntity.ok(ApiResponse.success(shop));
    }

    // ─── Owner Endpoints ────────────────────────────────────

    @PostMapping("/api/owner/shops")
    public ResponseEntity<ApiResponse<ShopResponse>> registerShop(
            @Valid @RequestBody ShopRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        ShopResponse shop = shopService.registerShop(request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Shop registered successfully and is pending admin approval.", shop));
    }

    @GetMapping("/api/owner/shops/my")
    public ResponseEntity<ApiResponse<ShopResponse>> getMyShop(@AuthenticationPrincipal CustomUserDetails userDetails) {
        ShopResponse shop = shopService.getShopByOwnerId(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(shop));
    }

    @PutMapping("/api/owner/shops/services")
    public ResponseEntity<ApiResponse<ShopResponse>> updateOfferedServices(
            @RequestBody List<Long> serviceTypeIds,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        ShopResponse shop = shopService.updateOfferedServices(serviceTypeIds, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Shop services updated successfully.", shop));
    }
}
