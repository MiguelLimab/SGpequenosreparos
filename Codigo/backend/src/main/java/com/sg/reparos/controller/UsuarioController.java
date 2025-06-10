package com.sg.reparos.controller;

import com.sg.reparos.dto.UsuarioAdminDTO;
import com.sg.reparos.dto.UsuarioUpdateDTO;
import com.sg.reparos.model.Usuario;
import com.sg.reparos.model.Usuario.TipoUsuario;
import com.sg.reparos.service.UsuarioService;
import com.sg.reparos.repository.UsuarioRepository;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioService.listarUsuarios();
    }

    @GetMapping("/{id}")
    public Optional<Usuario> buscarUsuario(@PathVariable Long id) {
        return usuarioService.buscarPorId(id);
    }

    @GetMapping("/perfil")
    public Usuario buscarPerfilUsuario(Principal principal) {
        return usuarioService.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    @PostMapping("/cadstro")
    public Usuario criarUsuario(@RequestBody @Valid Usuario usuario) {
        return usuarioService.salvarUsuario(usuario);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Usuario salvarUsuarioPorAdmin(@RequestBody @Valid UsuarioAdminDTO dto) {
        return usuarioService.salvarUsuarioPorAdmin(dto);
    }

    @PutMapping("/perfil")
    public Usuario atualizarUsuario(@Valid @RequestBody UsuarioUpdateDTO dto, Principal principal) {
        Usuario usuario = usuarioRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return usuarioService.atualizarUsuario(usuario.getId(), dto);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Usuario atualizarUsuarioPorAdmin(@PathVariable Long id, @RequestBody @Valid UsuarioAdminDTO dto) {
        return usuarioService.atualizarUsuarioPorAdmin(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deletarUsuario(@PathVariable Long id) {
        usuarioService.deletarUsuario(id);
    }

    @GetMapping("/tipos")
    public TipoUsuario[] listarTiposUsuarios() {
        return TipoUsuario.values();
    }
}
