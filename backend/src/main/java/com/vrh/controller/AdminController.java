package com.vrh.controller;

import com.vrh.dto.AdminStatsResponse;
import com.vrh.dto.ApiResponse;
import com.vrh.dto.ShopResponse;
import com.vrh.entity.User;
import com.vrh.entity.enums.ShopStatus;
import com.vrh.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/shops")
    public ResponseEntity<ApiResponse<List<ShopResponse>>> getAllShops() {
        List<ShopResponse> shops = adminService.getAllShops();
        return ResponseEntity.ok(ApiResponse.success(shops));
    }

    @PutMapping("/shops/{id}/status")
    public ResponseEntity<ApiResponse<ShopResponse>> updateShopStatus(
            @PathVariable Long id,
            @RequestParam ShopStatus status
    ) {
        ShopResponse shop = adminService.updateShopStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Shop status updated successfully to " + status, shop));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> getStats() {
        AdminStatsResponse stats = adminService.getStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
