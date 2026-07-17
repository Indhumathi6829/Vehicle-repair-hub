package com.vrh.service;

import com.vrh.dto.ServiceTypeRequest;
import com.vrh.entity.ServiceType;
import com.vrh.exception.BadRequestException;
import com.vrh.repository.ServiceTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceTypeService {

    private final ServiceTypeRepository serviceTypeRepository;

    public ServiceTypeService(ServiceTypeRepository serviceTypeRepository) {
        this.serviceTypeRepository = serviceTypeRepository;
    }

    public List<ServiceType> getAllServiceTypes() {
        return serviceTypeRepository.findAll();
    }

    public ServiceType createServiceType(ServiceTypeRequest request) {
        if (serviceTypeRepository.existsByNameIgnoreCase(request.getName())) {
            throw new BadRequestException("Service type with this name already exists");
        }

        ServiceType serviceType = ServiceType.builder()
                .name(request.getName())
                .basePrice(request.getBasePrice())
                .description(request.getDescription())
                .build();

        return serviceTypeRepository.save(serviceType);
    }
}
