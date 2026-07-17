package com.vrh.repository;

import com.vrh.entity.ShopOffering;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShopOfferingRepository extends JpaRepository<ShopOffering, Long> {
    List<ShopOffering> findByShopId(Long shopId);
    Optional<ShopOffering> findByShopIdAndServiceTypeId(Long shopId, Long serviceTypeId);
    void deleteByShopIdAndServiceTypeId(Long shopId, Long serviceTypeId);
}
