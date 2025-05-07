package com.sg.reparos.controller;

import com.sg.reparos.model.User;
import com.sg.reparos.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/userlist")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") // ajuste a porta conforme necessário
public class AdminUserList {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
