package com.vrh.dto;

import com.vrh.entity.ServiceType;
import com.vrh.entity.enums.ShopStatus;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopResponse {
    private Long id;
    private String name;
    private String address;
    private String city;
    private Long ownerId;
    private String ownerName;
    private ShopStatus status;
    private Double avgRating;
    private List<ServiceType> services;
}
