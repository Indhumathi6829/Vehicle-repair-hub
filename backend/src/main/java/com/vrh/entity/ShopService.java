package com.vrh.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "shop_services",
       uniqueConstraints = @UniqueConstraint(columnNames = {"shop_id", "service_type_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ShopService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "service_type_id", nullable = false)
    private ServiceType serviceType;
}
