package com.sg.reparos.service;

import com.sg.reparos.dto.ProfileUpdateDto;
import com.sg.reparos.dto.RegisterDto;
import com.sg.reparos.dto.UserDto;
import com.sg.reparos.model.Role;
import com.sg.reparos.model.User;
import com.sg.reparos.repository.UserRepository;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    public UserDto register(RegisterDto registerDto) {
        if (!registerDto.getPassword().equals(registerDto.getConfirmPassword())) {
            throw new RuntimeException("Senhas não coincidem");
        }
        
        if (userRepository.existsByUsername(registerDto.getUsername())) {
            throw new RuntimeException("Nome de usuário já existe");
        }
        
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }
        
        User user = new User();
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setRole(Role.ROLE_USER); // Default role
        
        User savedUser = userRepository.save(user);
        
        return convertToDto(savedUser);
    }
    
    private UserDto convertToDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        userDto.setRole(user.getRole());
        return userDto;
    }

    public UserDto updateUserProfile(Long userId, ProfileUpdateDto updateDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        // Verificar se o email já existe (para outro usuário)
        if (!user.getEmail().equals(updateDto.getEmail()) && 
            userRepository.existsByEmail(updateDto.getEmail())) {
            throw new RuntimeException("Email já está em uso por outro usuário");
        }
        
        // Verificar se o username já existe (para outro usuário)
        if (!user.getUsername().equals(updateDto.getUsername()) && 
            userRepository.existsByUsername(updateDto.getUsername())) {
            throw new RuntimeException("Nome de usuário já está em uso");
        }
        
        // Atualizar campos básicos
        user.updateUsername(updateDto.getUsername());
        user.updateEmail(updateDto.getEmail());
        
        // Atualizar senha se fornecida
        if (updateDto.getNewPassword() != null && !updateDto.getNewPassword().isEmpty()) {
            if (!passwordEncoder.matches(updateDto.getCurrentPassword(), user.getPassword())) {
                throw new RuntimeException("Senha atual incorreta");
            }
            if (!updateDto.getNewPassword().equals(updateDto.getConfirmPassword())) {
                throw new RuntimeException("Nova senha e confirmação não coincidem");
            }
            user.updatePassword(updateDto.getNewPassword(), passwordEncoder);
        }
        
        User updatedUser = userRepository.save(user);
        return convertToDto(updatedUser);
    }
    
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("Usuário não encontrado");
        }
        userRepository.deleteById(userId);
    }

    public Optional<User> findByUsername(String name) {
        return userRepository.findByUsername(name);
    }

}