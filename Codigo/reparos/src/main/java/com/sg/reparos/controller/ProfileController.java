package com.sg.reparos.controller;

import com.sg.reparos.dto.ProfileUpdateDto;
import com.sg.reparos.model.User;
import com.sg.reparos.service.UserService;
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
}