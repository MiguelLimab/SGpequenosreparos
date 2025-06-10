package com.sg.reparos.controller;

import com.sg.reparos.dto.ServicoRequestDTO;
import com.sg.reparos.dto.ServicoResponseDTO;
import com.sg.reparos.service.ServicoService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicos")
public class ServicoController {

    private final ServicoService servicoService;

    public ServicoController(ServicoService servicoService) {
        this.servicoService = servicoService;
    }

    // ✅ CLIENTE: Criar nova solicitação de serviço
    @PostMapping
    public ResponseEntity<ServicoResponseDTO> solicitarServico(
            @Valid @RequestBody ServicoRequestDTO dto) {
        ServicoResponseDTO response = servicoService.solicitarServico(dto);
        return ResponseEntity.ok(response);
    }

    // ✅ ADMIN/CLIENTE: Listar todos os serviços (com base no perfil será filtrado no frontend)
    @GetMapping
    public ResponseEntity<List<ServicoResponseDTO>> listarTodos() {
        List<ServicoResponseDTO> servicos = servicoService.listarTodos();
        return ResponseEntity.ok(servicos);
    }

    // ✅ ADMIN/CLIENTE: Buscar serviço específico por ID
    @GetMapping("/{id}")
    public ResponseEntity<ServicoResponseDTO> buscarPorId(@PathVariable Long id) {
        ServicoResponseDTO servico = servicoService.buscarPorId(id);
        return ResponseEntity.ok(servico);
    }

    // ✅ ADMIN: Aceitar serviço (agendamento com data e hora)
    @PutMapping("/{id}/aceitar")
    public ResponseEntity<ServicoResponseDTO> aceitarServico(
            @PathVariable Long id,
            @RequestParam Long administradorId,
            @RequestParam String data,
            @RequestParam String horario) {
        ServicoResponseDTO response = servicoService.aceitarServico(id, administradorId, data, horario);
        return ResponseEntity.ok(response);
    }

    // ✅ ADMIN: Recusar serviço
    @PutMapping("/{id}/recusar")
    public ResponseEntity<ServicoResponseDTO> recusarServico(@PathVariable Long id) {
        ServicoResponseDTO response = servicoService.recusarServico(id);
        return ResponseEntity.ok(response);
    }

    // ✅ ADMIN: Cancelar serviço com motivo
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<ServicoResponseDTO> cancelarServico(
            @PathVariable Long id,
            @RequestParam String motivo) {
        ServicoResponseDTO response = servicoService.cancelarServico(id, motivo);
        return ResponseEntity.ok(response);
    }

    // ✅ ADMIN: Marcar serviço como concluído
    @PutMapping("/{id}/concluir")
    public ResponseEntity<ServicoResponseDTO> concluirServico(@PathVariable Long id) {
        ServicoResponseDTO response = servicoService.concluirServico(id);
        return ResponseEntity.ok(response);
    }

    // ✅ ADMIN: Editar serviço (nome, tipo, cliente, etc.)
    @PutMapping("/{id}")
    public ResponseEntity<ServicoResponseDTO> editarServico(
            @PathVariable Long id,
            @Valid @RequestBody ServicoRequestDTO dto) {
        ServicoResponseDTO atualizado = servicoService.editarServico(id, dto);
        return ResponseEntity.ok(atualizado);
    }
}
