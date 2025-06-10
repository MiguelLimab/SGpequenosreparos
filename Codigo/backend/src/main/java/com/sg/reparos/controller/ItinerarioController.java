package com.sg.reparos.controller;

import com.sg.reparos.dto.ItinerarioRequest;
import com.sg.reparos.dto.ItinerarioResponse;
import com.sg.reparos.service.ItinerarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/itinerarios")
public class ItinerarioController {

    @Autowired
    private ItinerarioService itinerarioService;

    // Criar ou atualizar o itinerário do usuário logado
    @PostMapping
    public ResponseEntity<ItinerarioResponse> criarOuAtualizar(@Valid @RequestBody ItinerarioRequest request) {
        ItinerarioResponse response = itinerarioService.criarOuAtualizar(request);
        return ResponseEntity.ok(response);
    }

    // Buscar o itinerário do usuário logado
    @GetMapping("/meu-itinerario")
    public ResponseEntity<ItinerarioResponse> buscarMeuItinerario() {
        ItinerarioResponse response = itinerarioService.buscarMeuItinerario();
        if (response == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(response);
    }

    // Deletar itinerário pelo id (aqui pode-se implementar restrição para só permitir o próprio usuário deletar)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        itinerarioService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
