package com.vrh.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleRequest {

    @NotBlank(message = "Vehicle type is required (e.g. Car, Bike)")
    private String type;

    @NotBlank(message = "Brand is required (e.g. Honda, Tesla)")
    private String brand;

    @NotBlank(message = "Model is required")
    private String model;

    @NotBlank(message = "Registration number is required")
    private String regNumber;
}
