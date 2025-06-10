package com.sg.reparos.controller;

import com.sg.reparos.dto.NotificacaoRequestDTO;
import com.sg.reparos.dto.NotificacaoResponseDTO;
import com.sg.reparos.service.NotificacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificacoes")
@RequiredArgsConstructor
public class NotificacaoController {

    private final NotificacaoService notificacaoService;

    @PostMapping
    public ResponseEntity<Void> enviar(@RequestBody NotificacaoRequestDTO dto) {
        notificacaoService.enviar(dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<NotificacaoResponseDTO>> listarPorUsuario(@PathVariable Long id) {
        return ResponseEntity.ok(notificacaoService.listarPorUsuario(id)); // ✅ método atualizado
    }

    @GetMapping("/usuario/{id}/recentes")
    public ResponseEntity<List<NotificacaoResponseDTO>> listarRecentes(@PathVariable Long id) {
        return ResponseEntity.ok(notificacaoService.listarRecentes(id));
    }
}
