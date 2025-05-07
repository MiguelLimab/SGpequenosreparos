package com.sg.reparos.controller;

import com.sg.reparos.model.Service.ServiceStatus;
import com.sg.reparos.model.User;
import com.sg.reparos.repository.UserRepository;
import com.sg.reparos.repository.ServiceRepository;  // Importar o repositório de serviços
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import com.sg.reparos.dto.UserDto;

import java.util.List;

@RestController
@RequestMapping("/admin/userlist")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
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
            UserDto userDTO = new UserDto();
            userDTO.setId(user.getId());
            userDTO.setUsername(user.getUsername());
            userDTO.setEmail(user.getEmail());
            userDTO.setRole(user.getRole());

            // Contar serviços por status
            long totalServices = serviceRepository.countByUser(user);
            long completedServices = serviceRepository.countByUserAndStatus(user, ServiceStatus.FINALIZADO);
            long canceledServices = serviceRepository.countByUserAndStatus(user, ServiceStatus.CANCELADO);
            long otherServices = totalServices - (completedServices + canceledServices);

            userDTO.setTotalServices(totalServices);
            userDTO.setCompletedServices(completedServices);
            userDTO.setCanceledServices(canceledServices);
            userDTO.setOtherServices(otherServices);

            userDTOs.add(userDTO);
        }

        return userDTOs;
    }
}
