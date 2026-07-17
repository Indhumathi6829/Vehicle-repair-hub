package com.vrh.repository;

import com.vrh.entity.ServiceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ServiceTypeRepository extends JpaRepository<ServiceType, Long> {
    Optional<ServiceType> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
}
