package com.vrh.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MechanicRequest {

    @NotBlank(message = "Mechanic name is required")
    private String name;

    @NotBlank(message = "Mechanic email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Temporary password is required")
    private String password;

    private String phone;

    private String specialization;
}
