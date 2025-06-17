package com.sg.reparos.service;

import com.sg.reparos.dto.UsuarioAdminDTO;
import com.sg.reparos.dto.UsuarioUpdateDTO;
import com.sg.reparos.model.Usuario;
import com.sg.reparos.model.Usuario.TipoUsuario;
import com.sg.reparos.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public Optional<Usuario> findByUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Usuario salvarUsuario(Usuario usuario) {
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return usuarioRepository.save(usuario);
    }

    public Usuario salvarUsuarioPorAdmin(UsuarioAdminDTO dto) {
    // Verificar se o username já existe
    if (usuarioRepository.existsByUsername(dto.getUsername())) {
        throw new RuntimeException("Username já cadastrado.");
    }

    Usuario usuario = new Usuario();
    usuario.setNome(dto.getNome());
    usuario.setEmail(dto.getEmail());
    usuario.setTelefone(dto.getTelefone());
    usuario.setUsername(dto.getUsername());
    usuario.setSenha(passwordEncoder.encode(dto.getSenha()));

    // Convertendo String para Enum
    try {
        TipoUsuario tipoUsuario = TipoUsuario.valueOf(dto.getTipo().toUpperCase());
        usuario.setTipo(tipoUsuario);
    } catch (IllegalArgumentException e) {
        throw new RuntimeException("Tipo de usuário inválido: " + dto.getTipo());
    }

    return usuarioRepository.save(usuario);
}

    public Usuario atualizarUsuario(Long id, UsuarioUpdateDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
                
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setTelefone(dto.getTelefone());

        if (dto.getSenha() != null && !dto.getSenha().isEmpty()) {
            usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        }

        return usuarioRepository.save(usuario);
    }

public Usuario atualizarUsuarioPorAdmin(Long id, UsuarioAdminDTO dto) {
    Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

    usuario.setNome(dto.getNome());
    usuario.setEmail(dto.getEmail());
    usuario.setTelefone(dto.getTelefone());
    usuario.setUsername(dto.getUsername());

    // Conversão String -> Enum
    try {
        TipoUsuario tipoUsuario = TipoUsuario.valueOf(dto.getTipo().toUpperCase());
        usuario.setTipo(tipoUsuario); // Agora estamos passando o enum
    } catch (IllegalArgumentException e) {
        throw new RuntimeException("Tipo de usuário inválido: " + dto.getTipo());
    }

    if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
    }

    return usuarioRepository.save(usuario);
}


    public void deletarUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }
}
