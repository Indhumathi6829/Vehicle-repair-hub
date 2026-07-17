package com.vrh.dto;

import com.vrh.entity.enums.Role;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String email;
    private Role role;
    private Long userId;
    private String name;
}
