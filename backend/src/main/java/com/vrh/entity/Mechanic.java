package com.vrh.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mechanics")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Mechanic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;

    private String specialization;

    @Builder.Default
    private Boolean isAvailable = true;
}
