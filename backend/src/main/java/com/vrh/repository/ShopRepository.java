package com.vrh.repository;

import com.vrh.entity.Shop;
import com.vrh.entity.User;
import com.vrh.entity.enums.ShopStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {
    Optional<Shop> findByOwner(User owner);
    Optional<Shop> findByOwnerId(Long ownerId);

    Page<Shop> findByStatus(ShopStatus status, Pageable pageable);
    Page<Shop> findByStatusAndCityIgnoreCase(ShopStatus status, String city, Pageable pageable);

    @Query("SELECT s FROM Shop s JOIN s.shopServices ss WHERE s.status = :status AND ss.serviceType.id = :serviceTypeId")
    Page<Shop> findByStatusAndServiceType(@Param("status") ShopStatus status, @Param("serviceTypeId") Long serviceTypeId, Pageable pageable);

    @Query("SELECT s FROM Shop s JOIN s.shopServices ss WHERE s.status = :status AND LOWER(s.city) = LOWER(:city) AND ss.serviceType.id = :serviceTypeId")
    Page<Shop> findByStatusAndCityAndServiceType(@Param("status") ShopStatus status, @Param("city") String city, @Param("serviceTypeId") Long serviceTypeId, Pageable pageable);
}
