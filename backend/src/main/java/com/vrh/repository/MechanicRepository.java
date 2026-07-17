package com.vrh.repository;

import com.vrh.entity.Mechanic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MechanicRepository extends JpaRepository<Mechanic, Long> {
    Optional<Mechanic> findByUserId(Long userId);
    List<Mechanic> findByShopId(Long shopId);
    List<Mechanic> findByShopIdAndIsAvailable(Long shopId, Boolean isAvailable);
}
