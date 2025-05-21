package com.sg.reparos.controller;

import com.sg.reparos.dto.UserDto;
import com.sg.reparos.model.Service.ServiceStatus;
import com.sg.reparos.model.User;
import com.sg.reparos.repository.ServiceRepository;
import com.sg.reparos.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin/userlist")
@CrossOrigin(
    origins = "http://localhost:3000", 
    allowCredentials = "true",
    allowedHeaders = "*",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE}
)
public class AdminUserList {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @GetMapping
    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDto> userDTOs = new ArrayList<>();

        for (User user : users) {
            userDTOs.add(convertToDto(user));
        }

        return userDTOs;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        Optional<User> optUser = userRepository.findById(id);
        if (optUser.isPresent()) {
            return ResponseEntity.ok(convertToDto(optUser.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {
        System.out.println("Recebida requisição para atualizar usuário ID: " + id);
        System.out.println("Dados recebidos: " + userDto);
        
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

@DeleteMapping("/{id}")
public ResponseEntity<?> deleteUser(@PathVariable Long id) {
    System.out.println("Recebida requisição para deletar usuário ID: " + id);
    
    try {
        // Verifica se o usuário existe
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        // Primeiro deleta os serviços associados ao usuário
        serviceRepository.deleteByUser_Id(id);
        
        // Depois deleta o usuário
        userRepository.deleteById(id);
        
        System.out.println("Usuário ID " + id + " deletado com sucesso");
        return ResponseEntity.ok().build();
    } catch (Exception e) {
        System.out.println("Erro ao deletar usuário ID " + id + ": " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
               .body("Erro ao deletar usuário: " + e.getMessage());
    }
}
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