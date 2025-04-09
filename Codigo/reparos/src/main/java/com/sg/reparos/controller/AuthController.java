package com.sg.reparos.controller;

import com.sg.reparos.dto.RegisterDto;
import com.sg.reparos.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/auth")
public class AuthController {
    
    private final UserService userService;
    
    public AuthController(UserService userService) {
        this.userService = userService;
    }
    
    @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        model.addAttribute("user", new RegisterDto());
        return "register";
    }
    
    @PostMapping("/register")
    public String registerUser(RegisterDto registerDto, Model model) {
        try {
            userService.register(registerDto);
            return "redirect:/login?success";
        } catch (RuntimeException e) {
            model.addAttribute("error", e.getMessage());
            model.addAttribute("registerDto", registerDto);
            return "register";
        }
    }

    @GetMapping("/login")
    public String showLoginForm() {
        return "login";
    }


    @GetMapping("/logout")
    public String logout() {
        return "redirect:/login?logout";
    }
}