package com.sg.reparos.service;

import com.sg.reparos.dto.ItinerarioRequest;
import com.sg.reparos.dto.ItinerarioResponse;
import com.sg.reparos.model.Itinerario;
import com.sg.reparos.model.Itinerario.TipoItinerario;
import com.sg.reparos.model.Usuario;
import com.sg.reparos.model.Usuario.TipoUsuario;
import com.sg.reparos.repository.ItinerarioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;
import java.util.List;

@Service
public class ItinerarioService {

    @Autowired
    private ItinerarioRepository itinerarioRepository;

    @Autowired
    private UsuarioService usuarioService;

    // Obtém o usuário logado via Spring Security
    private Usuario getUsuarioLogado() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return usuarioService.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Usuário logado não encontrado"));
    }

    // Validação condicional do DTO
    private void validarDto(ItinerarioRequest dto) {
        if (dto.getTipoItinerario() == null) {
            throw new IllegalArgumentException("Tipo de itinerário é obrigatório");
        }

        if (dto.getTipoItinerario() == TipoItinerario.FIXO) {
            if (dto.getDiasSemana() == null || dto.getDiasSemana().isEmpty()) {
                throw new IllegalArgumentException("Para tipo FIXO, deve informar dias da semana");
            }
        } else if (dto.getTipoItinerario() == TipoItinerario.CICLICO) {
            if (dto.getDiasTrabalho() == null || dto.getDiasTrabalho() < 1) {
                throw new IllegalArgumentException("Para tipo CICLICO, deve informar dias de trabalho válidos");
            }
            if (dto.getDiasFolga() == null || dto.getDiasFolga() < 1) {
                throw new IllegalArgumentException("Para tipo CICLICO, deve informar dias de folga válidos");
            }
        }

        if (dto.getHoraInicio() == null) {
            throw new IllegalArgumentException("Hora de início é obrigatória");
        }

        if (dto.getHoraFim() == null) {
            throw new IllegalArgumentException("Hora de término é obrigatória");
        }
    }

    // Cria ou atualiza itinerário do usuário logado
    public ItinerarioResponse criarOuAtualizar(ItinerarioRequest dto) {
        validarDto(dto);

        Usuario profissional = getUsuarioLogado();

        if (profissional.getTipo() != TipoUsuario.ADMIN) {
            throw new IllegalArgumentException("Usuário logado não é um profissional válido (deve ser ADMIN)");
        }

        Optional<Itinerario> existenteOpt = itinerarioRepository.findByProfissional(profissional);

        Itinerario itinerario = existenteOpt.orElse(new Itinerario());
        itinerario.setProfissional(profissional);
        itinerario.setTipoItinerario(dto.getTipoItinerario());

        if (dto.getTipoItinerario() == TipoItinerario.FIXO) {
            itinerario.setDiasSemana(dto.getDiasSemana());
            itinerario.setDiasTrabalho(null);
            itinerario.setDiasFolga(null);
        } else {
            itinerario.setDiasSemana(null);
            itinerario.setDiasTrabalho(dto.getDiasTrabalho());
            itinerario.setDiasFolga(dto.getDiasFolga());
        }

        itinerario.setHoraInicio(dto.getHoraInicio());
        itinerario.setHoraFim(dto.getHoraFim());

        Itinerario salvo = itinerarioRepository.save(itinerario);

        return toResponse(salvo);
    }

    // Busca itinerário do usuário logado
    public ItinerarioResponse buscarMeuItinerario() {
        Usuario profissional = getUsuarioLogado();
        Optional<Itinerario> opt = itinerarioRepository.findByProfissional(profissional);
        return opt.map(this::toResponse).orElse(null);
    }

    // Deleta itinerário por ID
    public void deletar(Long id) {
        itinerarioRepository.deleteById(id);
    }

    // Conversão entidade para DTO resposta
    private ItinerarioResponse toResponse(Itinerario i) {
        ItinerarioResponse resp = new ItinerarioResponse();
        resp.setId(i.getId());
        resp.setProfissionalId(i.getProfissional().getId());
        resp.setProfissionalNome(i.getProfissional().getNome());
        resp.setTipoItinerario(i.getTipoItinerario());
        resp.setDiasSemana(i.getDiasSemana());
        resp.setDiasTrabalho(i.getDiasTrabalho());
        resp.setDiasFolga(i.getDiasFolga());
        resp.setHoraInicio(i.getHoraInicio());
        resp.setHoraFim(i.getHoraFim());
        return resp;
    }
}
