package com.vrh.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RepairRequestBook {

    @NotNull(message = "Shop ID is required")
    private Long shopId;

    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;

    @NotNull(message = "Service Type ID is required")
    private Long serviceTypeId;

    @NotBlank(message = "Issue description is required")
    private String issueDescription;
}
