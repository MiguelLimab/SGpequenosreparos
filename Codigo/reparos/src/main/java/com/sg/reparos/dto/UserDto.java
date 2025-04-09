package com.sg.reparos.dto;

import com.sg.reparos.model.Role;
import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private Role role;
}