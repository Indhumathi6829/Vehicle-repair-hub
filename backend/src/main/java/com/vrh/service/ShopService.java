package com.vrh.service;

import com.vrh.dto.ShopRequest;
import com.vrh.dto.ShopResponse;
import com.vrh.entity.ServiceType;
import com.vrh.entity.Shop;
import com.vrh.entity.ShopOffering;
import com.vrh.entity.User;
import com.vrh.entity.enums.ShopStatus;
import com.vrh.exception.BadRequestException;
import com.vrh.exception.ResourceNotFoundException;
import com.vrh.repository.ServiceTypeRepository;
import com.vrh.repository.ShopOfferingRepository;
import com.vrh.repository.ShopRepository;
import com.vrh.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShopService {

    private final ShopRepository shopRepository;
    private final UserRepository userRepository;
    private final ServiceTypeRepository serviceTypeRepository;
    private final ShopOfferingRepository shopOfferingRepository;

    public ShopService(ShopRepository shopRepository, UserRepository userRepository,
                       ServiceTypeRepository serviceTypeRepository, ShopOfferingRepository shopOfferingRepository) {
        this.shopRepository = shopRepository;
        this.userRepository = userRepository;
        this.serviceTypeRepository = serviceTypeRepository;
        this.shopOfferingRepository = shopOfferingRepository;
    }

    public ShopResponse registerShop(ShopRequest request, Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        if (shopRepository.findByOwner(owner).isPresent()) {
            throw new BadRequestException("You have already registered a shop. Shop Owners can register at most one shop.");
        }

        Shop shop = Shop.builder()
                .name(request.getName())
                .address(request.getAddress())
                .city(request.getCity())
                .owner(owner)
                .status(ShopStatus.PENDING)
                .avgRating(0.0)
                .build();

        Shop savedShop = shopRepository.save(shop);
        return mapToResponse(savedShop);
    }

    public ShopResponse getShopById(Long shopId) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found with ID: " + shopId));
        return mapToResponse(shop);
    }

    public ShopResponse getShopByOwnerId(Long ownerId) {
        Shop shop = shopRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found for owner ID: " + ownerId));
        return mapToResponse(shop);
    }

    @Transactional
    public ShopResponse updateOfferedServices(List<Long> serviceTypeIds, Long ownerId) {
        Shop shop = shopRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found for this owner"));

        // Clear existing services
        shop.getShopServices().clear();
        shopRepository.saveAndFlush(shop);

        // Fetch and map new services
        for (Long serviceId : serviceTypeIds) {
            ServiceType serviceType = serviceTypeRepository.findById(serviceId)
                    .orElseThrow(() -> new ResourceNotFoundException("Service type not found with ID: " + serviceId));

            ShopOffering offering = ShopOffering.builder()
                    .shop(shop)
                    .serviceType(serviceType)
                    .build();
            shop.getShopServices().add(offering);
        }

        Shop updatedShop = shopRepository.save(shop);
        return mapToResponse(updatedShop);
    }

    public Page<ShopResponse> getApprovedShops(String city, Long serviceTypeId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Shop> shops;

        if (city != null && !city.trim().isEmpty() && serviceTypeId != null) {
            shops = shopRepository.findByStatusAndCityAndServiceType(ShopStatus.APPROVED, city.trim(), serviceTypeId, pageable);
        } else if (city != null && !city.trim().isEmpty()) {
            shops = shopRepository.findByStatusAndCityIgnoreCase(ShopStatus.APPROVED, city.trim(), pageable);
        } else if (serviceTypeId != null) {
            shops = shopRepository.findByStatusAndServiceType(ShopStatus.APPROVED, serviceTypeId, pageable);
        } else {
            shops = shopRepository.findByStatus(ShopStatus.APPROVED, pageable);
        }

        return shops.map(this::mapToResponse);
    }

    public ShopResponse mapToResponse(Shop shop) {
        List<ServiceType> services = shop.getShopServices().stream()
                .map(ShopOffering::getServiceType)
                .collect(Collectors.toList());

        return ShopResponse.builder()
                .id(shop.getId())
                .name(shop.getName())
                .address(shop.getAddress())
                .city(shop.getCity())
                .ownerId(shop.getOwner().getId())
                .ownerName(shop.getOwner().getName())
                .status(shop.getStatus())
                .avgRating(shop.getAvgRating())
                .services(services)
                .build();
    }
}
