package com.vrh.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStatsResponse {
    private long totalUsers;
    private long totalShops;
    private long totalJobs;
    private long totalCustomers;
}
