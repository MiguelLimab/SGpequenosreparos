package com.sg.reparos.controller;

import com.sg.reparos.dto.UserDto;
import com.sg.reparos.model.Service.ServiceStatus;
import com.sg.reparos.model.User;
import com.sg.reparos.repository.ServiceRepository;
import com.sg.reparos.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin/userlist")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AdminUserList {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    // GET: Lista todos os usuários com estatísticas
    @GetMapping
    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDto> userDTOs = new ArrayList<>();

        for (User user : users) {
            userDTOs.add(convertToDto(user));
        }

        return userDTOs;
    }

    // GET: Busca um usuário pelo ID com estatísticas
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        Optional<User> optUser = userRepository.findById(id);
        if (optUser.isPresent()) {
            return ResponseEntity.ok(convertToDto(optUser.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // PUT: Atualiza dados básicos de um usuário
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {
        Optional<User> optUser = userRepository.findById(id);
        if (optUser.isPresent()) {
            User user = optUser.get();
            user.setUsername(userDto.getUsername());
            user.setEmail(userDto.getEmail());
            user.setRole(userDto.getRole());
            userRepository.save(user);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE: Exclui o usuário
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Optional<User> optUser = userRepository.findById(id);
        if (optUser.isPresent()) {
            userRepository.delete(optUser.get());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Método auxiliar para converter User → UserDto
    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());

        long totalServices = serviceRepository.countByUser(user);
        long completedServices = serviceRepository.countByUserAndStatus(user, ServiceStatus.FINALIZADO);
        long canceledServices = serviceRepository.countByUserAndStatus(user, ServiceStatus.CANCELADO);
        long otherServices = totalServices - (completedServices + canceledServices);

        dto.setTotalServices(totalServices);
        dto.setCompletedServices(completedServices);
        dto.setCanceledServices(canceledServices);
        dto.setOtherServices(otherServices);

        return dto;
    }
}
