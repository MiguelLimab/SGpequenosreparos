package com.sg.reparos.controller;

import com.sg.reparos.dto.TipoServicoRequest;
import com.sg.reparos.dto.TipoServicoResponse;
import com.sg.reparos.service.TipoServicoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tiposervico")
public class TipoServicoController {

    @Autowired
    private TipoServicoService tipoServicoService;

    // POST: Criar um novo Tipo de Serviço
    @PostMapping
    public ResponseEntity<TipoServicoResponse> criar(@Valid @RequestBody TipoServicoRequest request) {
        TipoServicoResponse response = tipoServicoService.criar(request);
        return ResponseEntity.ok(response);
    }

    // GET: Listar todos os Tipos de Serviço
    @GetMapping
    public ResponseEntity<List<TipoServicoResponse>> listarTodos() {
        List<TipoServicoResponse> tipos = tipoServicoService.listarTodos();
        return ResponseEntity.ok(tipos);
    }

    // GET: Buscar Tipo de Serviço por ID
    @GetMapping("/{id}")
    public ResponseEntity<TipoServicoResponse> buscarPorId(@PathVariable Long id) {
        TipoServicoResponse tipo = tipoServicoService.buscarPorId(id);
        return ResponseEntity.ok(tipo);
    }

    // PUT: Atualizar Tipo de Serviço
    @PutMapping("/{id}")
    public ResponseEntity<TipoServicoResponse> atualizar(@PathVariable Long id, @Valid @RequestBody TipoServicoRequest request) {
        TipoServicoResponse response = tipoServicoService.atualizar(id, request);
        return ResponseEntity.ok(response);
    }

    // DELETE: Deletar Tipo de Serviço
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        tipoServicoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
