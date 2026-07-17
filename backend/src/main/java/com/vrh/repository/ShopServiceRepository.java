package com.vrh.repository;

import com.vrh.entity.ShopService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShopServiceRepository extends JpaRepository<ShopService, Long> {
    List<ShopService> findByShopId(Long shopId);
    Optional<ShopService> findByShopIdAndServiceTypeId(Long shopId, Long serviceTypeId);
    void deleteByShopIdAndServiceTypeId(Long shopId, Long serviceTypeId);
}
