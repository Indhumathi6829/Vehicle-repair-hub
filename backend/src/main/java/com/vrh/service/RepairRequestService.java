package com.vrh.service;

import com.vrh.dto.RepairRequestBook;
import com.vrh.dto.RepairRequestResponse;
import com.vrh.entity.*;
import com.vrh.entity.enums.RepairStatus;
import com.vrh.entity.enums.ShopStatus;
import com.vrh.exception.BadRequestException;
import com.vrh.exception.ResourceNotFoundException;
import com.vrh.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class RepairRequestService {

    private final RepairRequestRepository repairRequestRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final ShopRepository shopRepository;
    private final MechanicRepository mechanicRepository;
    private final ServiceTypeRepository serviceTypeRepository;
    private final ShopOfferingRepository shopOfferingRepository;
    private final ReviewRepository reviewRepository;

    public RepairRequestService(RepairRequestRepository repairRequestRepository, UserRepository userRepository,
                                VehicleRepository vehicleRepository, ShopRepository shopRepository,
                                MechanicRepository mechanicRepository, ServiceTypeRepository serviceTypeRepository,
                                ShopOfferingRepository shopOfferingRepository, ReviewRepository reviewRepository) {
        this.repairRequestRepository = repairRequestRepository;
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.shopRepository = shopRepository;
        this.mechanicRepository = mechanicRepository;
        this.serviceTypeRepository = serviceTypeRepository;
        this.shopOfferingRepository = shopOfferingRepository;
        this.reviewRepository = reviewRepository;
    }

    @Transactional
    public RepairRequestResponse bookRepair(RepairRequestBook request, Long customerId) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        if (!vehicle.getCustomer().getId().equals(customerId)) {
            throw new BadRequestException("This vehicle does not belong to you");
        }

        Shop shop = shopRepository.findById(request.getShopId())
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found"));

        if (shop.getStatus() != ShopStatus.APPROVED) {
            throw new BadRequestException("You can only book repairs with approved shops");
        }

        ServiceType serviceType = serviceTypeRepository.findById(request.getServiceTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Service type not found"));

        // Verify if shop offers this service type
        shopOfferingRepository.findByShopIdAndServiceTypeId(shop.getId(), serviceType.getId())
                .orElseThrow(() -> new BadRequestException("This shop does not offer the selected service type"));

        RepairRequest repairRequest = RepairRequest.builder()
                .customer(customer)
                .vehicle(vehicle)
                .shop(shop)
                .serviceType(serviceType)
                .issueDescription(request.getIssueDescription())
                .status(RepairStatus.REQUESTED)
                .cost(serviceType.getBasePrice())
                .build();

        RepairRequest savedRequest = repairRequestRepository.save(repairRequest);
        return mapToResponse(savedRequest);
    }

    public Page<RepairRequestResponse> getCustomerRequests(Long customerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("requestedAt").descending());
        return repairRequestRepository.findByCustomerId(customerId, pageable).map(this::mapToResponse);
    }

    public Page<RepairRequestResponse> getShopRequests(Long ownerId, int page, int size) {
        Shop shop = shopRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found for this owner"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("requestedAt").descending());
        return repairRequestRepository.findByShopId(shop.getId(), pageable).map(this::mapToResponse);
    }

    public Page<RepairRequestResponse> getMechanicRequests(Long mechanicUserId, int page, int size) {
        Mechanic mechanic = mechanicRepository.findByUserId(mechanicUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Mechanic not found for user ID: " + mechanicUserId));

        Pageable pageable = PageRequest.of(page, size, Sort.by("requestedAt").descending());
        return repairRequestRepository.findByMechanicId(mechanic.getId(), pageable).map(this::mapToResponse);
    }

    @Transactional
    public RepairRequestResponse assignMechanic(Long id, Long mechanicId, Long ownerId) {
        RepairRequest repairRequest = repairRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Repair request not found"));

        Shop shop = shopRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found for this owner"));

        if (!repairRequest.getShop().getId().equals(shop.getId())) {
            throw new BadRequestException("You can only manage requests for your own shop");
        }

        Mechanic mechanic = mechanicRepository.findById(mechanicId)
                .orElseThrow(() -> new ResourceNotFoundException("Mechanic not found"));

        if (!mechanic.getShop().getId().equals(shop.getId())) {
            throw new BadRequestException("This mechanic does not work in your shop");
        }

        repairRequest.setMechanic(mechanic);
        repairRequest.setStatus(RepairStatus.ACCEPTED);

        RepairRequest updated = repairRequestRepository.save(repairRequest);
        return mapToResponse(updated);
    }

    @Transactional
    public RepairRequestResponse updateStatus(Long id, RepairStatus newStatus, Long mechanicUserId) {
        RepairRequest repairRequest = repairRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Repair request not found"));

        Mechanic mechanic = mechanicRepository.findByUserId(mechanicUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Mechanic registration not found"));

        if (repairRequest.getMechanic() == null || !repairRequest.getMechanic().getId().equals(mechanic.getId())) {
            throw new BadRequestException("You can only update jobs explicitly assigned to you");
        }

        RepairStatus currentStatus = repairRequest.getStatus();

        if (newStatus == RepairStatus.IN_PROGRESS) {
            if (currentStatus != RepairStatus.ACCEPTED) {
                throw new BadRequestException("Job must be ACCEPTED before starting IN_PROGRESS");
            }
        } else if (newStatus == RepairStatus.COMPLETED) {
            if (currentStatus != RepairStatus.IN_PROGRESS) {
                throw new BadRequestException("Job must be IN_PROGRESS before completing");
            }
            repairRequest.setCompletedAt(LocalDateTime.now());
        } else if (newStatus == RepairStatus.CANCELLED) {
            if (currentStatus == RepairStatus.COMPLETED) {
                throw new BadRequestException("Cannot cancel a completed job");
            }
        } else {
            throw new BadRequestException("Invalid status transition requested");
        }

        repairRequest.setStatus(newStatus);
        RepairRequest updated = repairRequestRepository.save(repairRequest);
        return mapToResponse(updated);
    }

    public RepairRequestResponse mapToResponse(RepairRequest req) {
        String mechanicName = req.getMechanic() != null ? req.getMechanic().getUser().getName() : "Unassigned";
        Long mechanicId = req.getMechanic() != null ? req.getMechanic().getId() : null;
        boolean reviewed = reviewRepository.findByRepairRequestId(req.getId()).isPresent();

        return RepairRequestResponse.builder()
                .id(req.getId())
                .customerId(req.getCustomer().getId())
                .customerName(req.getCustomer().getName())
                .vehicleId(req.getVehicle().getId())
                .vehicleDetails(req.getVehicle().getBrand() + " " + req.getVehicle().getModel() + " (" + req.getVehicle().getRegNumber() + ")")
                .shopId(req.getShop().getId())
                .shopName(req.getShop().getName())
                .mechanicId(mechanicId)
                .mechanicName(mechanicName)
                .serviceTypeId(req.getServiceType().getId())
                .serviceTypeName(req.getServiceType().getName())
                .issueDescription(req.getIssueDescription())
                .status(req.getStatus())
                .cost(req.getCost())
                .requestedAt(req.getRequestedAt())
                .completedAt(req.getCompletedAt())
                .isReviewed(reviewed)
                .build();
    }
}
