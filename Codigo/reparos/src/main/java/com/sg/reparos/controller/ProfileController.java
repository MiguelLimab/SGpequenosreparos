package com.sg.reparos.controller;

import com.sg.reparos.dto.ProfileUpdateDto;
import com.sg.reparos.model.User;
import com.sg.reparos.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/profile")
public class ProfileController {

    private final UserService userService;

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    // ---------- ROTAS PARA HTML (Thymeleaf) ----------

    @GetMapping
    public String showProfile(Authentication authentication, Model model) {
        User user = (User) authentication.getPrincipal();
        model.addAttribute("user", user);
        model.addAttribute("updateDto", new ProfileUpdateDto());
        return "profile";
    }

    @PostMapping("/update")
    public String updateProfile(
            @ModelAttribute("updateDto") ProfileUpdateDto updateDto,
            Authentication authentication,
            Model model) {
        
        User currentUser = (User) authentication.getPrincipal();
        
        try {
            userService.updateUserProfile(currentUser.getId(), updateDto);
            return "redirect:/profile?success";
        } catch (RuntimeException e) {
            model.addAttribute("error", e.getMessage());
            model.addAttribute("user", currentUser);
            return "profile";
        }
    }

    @PostMapping("/delete")
    public String deleteProfile(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        userService.deleteUser(currentUser.getId());
        return "redirect:/logout";
    }

    // ---------- ROTAS PARA REACT (API REST) ----------

    @GetMapping("/api/profile")
    @ResponseBody
    public User getProfile(Authentication authentication) {
        return (User) authentication.getPrincipal();
    }

    @PutMapping("/api/profile")
    @ResponseBody
    public ResponseEntity<?> updateProfileReact(
            @RequestBody ProfileUpdateDto updateDto,
            Authentication authentication) {
        
        User currentUser = (User) authentication.getPrincipal();
        
        try {
            userService.updateUserProfile(currentUser.getId(), updateDto);
            return ResponseEntity.ok("Perfil atualizado com sucesso.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/api/profile")
    @ResponseBody
    public ResponseEntity<?> deleteProfileReact(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        userService.deleteUser(currentUser.getId());
        return ResponseEntity.ok("Conta excluída com sucesso.");
    }
}
