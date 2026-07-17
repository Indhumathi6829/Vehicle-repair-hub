package com.vrh.service;

import com.vrh.dto.VehicleRequest;
import com.vrh.dto.VehicleResponse;
import com.vrh.entity.User;
import com.vrh.entity.Vehicle;
import com.vrh.exception.ResourceNotFoundException;
import com.vrh.repository.UserRepository;
import com.vrh.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    public VehicleService(VehicleRepository vehicleRepository, UserRepository userRepository) {
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
    }

    public VehicleResponse addVehicle(VehicleRequest request, Long customerId) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Vehicle vehicle = Vehicle.builder()
                .customer(customer)
                .type(request.getType())
                .brand(request.getBrand())
                .model(request.getModel())
                .regNumber(request.getRegNumber())
                .build();

        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return mapToResponse(savedVehicle);
    }

    public List<VehicleResponse> getVehiclesByCustomer(Long customerId) {
        return vehicleRepository.findByCustomerId(customerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public VehicleResponse mapToResponse(Vehicle vehicle) {
        return VehicleResponse.builder()
                .id(vehicle.getId())
                .customerId(vehicle.getCustomer().getId())
                .type(vehicle.getType())
                .brand(vehicle.getBrand())
                .model(vehicle.getModel())
                .regNumber(vehicle.getRegNumber())
                .build();
    }
}
