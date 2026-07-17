package com.vrh.service;

import com.vrh.dto.MechanicRequest;
import com.vrh.dto.MechanicResponse;
import com.vrh.entity.Mechanic;
import com.vrh.entity.Shop;
import com.vrh.entity.User;
import com.vrh.entity.enums.Role;
import com.vrh.exception.BadRequestException;
import com.vrh.exception.ResourceNotFoundException;
import com.vrh.repository.MechanicRepository;
import com.vrh.repository.ShopRepository;
import com.vrh.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MechanicService {

    private final MechanicRepository mechanicRepository;
    private final ShopRepository shopRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public MechanicService(MechanicRepository mechanicRepository, ShopRepository shopRepository,
                           UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.mechanicRepository = mechanicRepository;
        this.shopRepository = shopRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public MechanicResponse addMechanic(MechanicRequest request, Long ownerId) {
        Shop shop = shopRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found for this owner. Please register your shop first."));

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use by another user");
        }

        // Create User first
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(Role.MECHANIC)
                .build();

        User savedUser = userRepository.save(user);

        // Create Mechanic
        Mechanic mechanic = Mechanic.builder()
                .user(savedUser)
                .shop(shop)
                .specialization(request.getSpecialization())
                .isAvailable(true)
                .build();

        Mechanic savedMechanic = mechanicRepository.save(mechanic);
        return mapToResponse(savedMechanic);
    }

    public List<MechanicResponse> getMechanicsByShop(Long ownerId) {
        Shop shop = shopRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found for this owner"));

        return mechanicRepository.findByShopId(shop.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<MechanicResponse> getAvailableMechanicsByShop(Long shopId) {
        return mechanicRepository.findByShopIdAndIsAvailable(shopId, true).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public MechanicResponse mapToResponse(Mechanic mechanic) {
        return MechanicResponse.builder()
                .id(mechanic.getId())
                .userId(mechanic.getUser().getId())
                .name(mechanic.getUser().getName())
                .email(mechanic.getUser().getEmail())
                .phone(mechanic.getUser().getPhone())
                .specialization(mechanic.getSpecialization())
                .isAvailable(mechanic.getIsAvailable())
                .shopId(mechanic.getShop().getId())
                .shopName(mechanic.getShop().getName())
                .build();
    }
}
