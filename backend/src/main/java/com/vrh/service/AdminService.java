package com.vrh.service;

import com.vrh.dto.AdminStatsResponse;
import com.vrh.dto.ShopResponse;
import com.vrh.entity.Shop;
import com.vrh.entity.User;
import com.vrh.entity.enums.Role;
import com.vrh.entity.enums.ShopStatus;
import com.vrh.exception.ResourceNotFoundException;
import com.vrh.repository.RepairRequestRepository;
import com.vrh.repository.ShopRepository;
import com.vrh.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ShopRepository shopRepository;
    private final RepairRequestRepository repairRequestRepository;
    private final ShopService shopService; // used to map to responses

    public AdminService(UserRepository userRepository, ShopRepository shopRepository,
                        RepairRequestRepository repairRequestRepository, ShopService shopService) {
        this.userRepository = userRepository;
        this.shopRepository = shopRepository;
        this.repairRequestRepository = repairRequestRepository;
        this.shopService = shopService;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<ShopResponse> getAllShops() {
        return shopRepository.findAll().stream()
                .map(shopService::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ShopResponse updateShopStatus(Long shopId, ShopStatus status) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found with ID: " + shopId));

        shop.setStatus(status);
        Shop updated = shopRepository.save(shop);
        return shopService.mapToResponse(updated);
    }

    public AdminStatsResponse getStats() {
        long totalUsers = userRepository.count();
        long totalShops = shopRepository.count();
        long totalJobs = repairRequestRepository.count();
        long totalCustomers = userRepository.findByRole(Role.CUSTOMER).size();

        return AdminStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalShops(totalShops)
                .totalJobs(totalJobs)
                .totalCustomers(totalCustomers)
                .build();
    }
}
