package com.sg.reparos.service;

import com.sg.reparos.dto.TipoServicoRequest;
import com.sg.reparos.dto.TipoServicoResponse;
import com.sg.reparos.model.TipoServico;
import com.sg.reparos.repository.TipoServicoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TipoServicoService {

    @Autowired
    private TipoServicoRepository tipoServicoRepository;

    // Criar novo Tipo de Serviço
    public TipoServicoResponse criar(TipoServicoRequest request) {
        if (tipoServicoRepository.findByNome(request.getNome()).isPresent()) {
            throw new IllegalArgumentException("Tipo de serviço com este nome já existe.");
        }

        TipoServico tipoServico = new TipoServico();
        tipoServico.setNome(request.getNome());
        tipoServico.setDescricao(request.getDescricao());
        tipoServico.setDuracao(request.getDuracao());

        TipoServico salvo = tipoServicoRepository.save(tipoServico);

        return toResponse(salvo);
    }

    // Listar todos os Tipos de Serviço
    public List<TipoServicoResponse> listarTodos() {
        List<TipoServico> tipos = tipoServicoRepository.findAll();
        return tipos.stream().map(this::toResponse).collect(Collectors.toList());
    }

    // Buscar Tipo de Serviço por ID
    public TipoServicoResponse buscarPorId(Long id) {
        TipoServico tipoServico = tipoServicoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tipo de serviço não encontrado"));
        return toResponse(tipoServico);
    }

    // Atualizar Tipo de Serviço
    public TipoServicoResponse atualizar(Long id, TipoServicoRequest request) {
        TipoServico tipoServico = tipoServicoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tipo de serviço não encontrado"));

        if (!tipoServico.getNome().equals(request.getNome()) &&
            tipoServicoRepository.findByNome(request.getNome()).isPresent()) {
            throw new IllegalArgumentException("Já existe um tipo de serviço com este nome.");
        }

        tipoServico.setNome(request.getNome());
        tipoServico.setDescricao(request.getDescricao());
        tipoServico.setDuracao(request.getDuracao());

        TipoServico atualizado = tipoServicoRepository.save(tipoServico);

        return toResponse(atualizado);
    }

    // Deletar Tipo de Serviço
    public void deletar(Long id) {
        TipoServico tipoServico = tipoServicoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tipo de serviço não encontrado"));
        tipoServicoRepository.delete(tipoServico);
    }

    // Método auxiliar para converter Model em Response
    private TipoServicoResponse toResponse(TipoServico tipoServico) {
        TipoServicoResponse response = new TipoServicoResponse();
        response.setId(tipoServico.getId());
        response.setNome(tipoServico.getNome());
        response.setDescricao(tipoServico.getDescricao());
        response.setDuracao(tipoServico.getDuracao());
        return response;
    }
}
