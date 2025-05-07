package com.sg.reparos.dto;

import com.sg.reparos.model.Role;
import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private Role role;
    private long totalServices;
    private long completedServices;
    private long canceledServices;
    private long otherServices;
}