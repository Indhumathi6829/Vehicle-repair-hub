package com.vrh.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleResponse {
    private Long id;
    private Long customerId;
    private String type;
    private String brand;
    private String model;
    private String regNumber;
}
