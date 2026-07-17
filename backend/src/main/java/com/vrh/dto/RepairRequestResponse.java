package com.vrh.dto;

import com.vrh.entity.enums.RepairStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RepairRequestResponse {
    private Long id;
    
    private Long customerId;
    private String customerName;
    
    private Long vehicleId;
    private String vehicleDetails; // brand + model + regNumber
    
    private Long shopId;
    private String shopName;
    
    private Long mechanicId;
    private String mechanicName;
    
    private Long serviceTypeId;
    private String serviceTypeName;
    
    private String issueDescription;
    private RepairStatus status;
    private BigDecimal cost;
    private LocalDateTime requestedAt;
    private LocalDateTime completedAt;
    
    private Boolean isReviewed;
}
