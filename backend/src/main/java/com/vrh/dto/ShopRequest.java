package com.vrh.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShopRequest {

    @NotBlank(message = "Shop name is required")
    private String name;

    @NotBlank(message = "Shop address is required")
    private String address;

    @NotBlank(message = "Shop city is required")
    private String city;
}
