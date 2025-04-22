package com.sg.reparos.dto;

import lombok.Data;

@Data
public class ProfileUpdateDto {
    private String username;
    private String email;
    private String currentPassword;
    private String newPassword;
    private String confirmPassword;
}