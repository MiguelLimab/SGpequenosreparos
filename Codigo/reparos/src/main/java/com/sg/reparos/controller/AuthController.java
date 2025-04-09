package com.sg.reparos.controller;

import com.sg.reparos.dto.RegisterDto;
import com.sg.reparos.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // Endpoint para páginas com Thymeleaf
    @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        model.addAttribute("user", new RegisterDto());
        return "register";
    }

    // Registro tradicional (formulário web)
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

    // Registro via frontend React (JSON)
    @PostMapping(path = "/register", consumes = "application/json")
    @ResponseBody
    public ResponseEntity<String> registerUserJson(@RequestBody RegisterDto registerDto) {
        try {
            userService.register(registerDto);
            return ResponseEntity.ok("Usuário cadastrado com sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
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