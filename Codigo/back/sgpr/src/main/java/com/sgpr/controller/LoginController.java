package com.sgpr.controller;

import com.sgpr.model.Usuario;
import com.sgpr.repository.UsuarioRepository;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.Optional;
@CrossOrigin(origins = "*")
@RestController
public class LoginController {
    
    private final UsuarioRepository usuarioRepository;

    public LoginController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        Optional<Usuario> usuario = usuarioRepository.findByEmail(request.email);
        
        if(usuario.isPresent() && usuario.get().getSenha().equals(request.senha)) {
            return "Login realizado com sucesso!";
        }
        return "Credenciais inválidas!";
    }

    static class LoginRequest {
        public String email;
        public String senha;
    }
}