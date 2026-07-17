package com.vrh.repository;

import com.vrh.entity.RepairRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepairRequestRepository extends JpaRepository<RepairRequest, Long> {
    Page<RepairRequest> findByCustomerId(Long customerId, Pageable pageable);
    Page<RepairRequest> findByShopId(Long shopId, Pageable pageable);
    Page<RepairRequest> findByMechanicId(Long mechanicId, Pageable pageable);
}
