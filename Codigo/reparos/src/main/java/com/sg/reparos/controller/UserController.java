package com.sg.reparos.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @GetMapping("/role")
    public String getUserRole(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .map(Object::toString)
                .filter(role -> role.equals("ROLE_ADMIN"))
                .findFirst()
                .orElse("ROLE_USER");
    }
}
