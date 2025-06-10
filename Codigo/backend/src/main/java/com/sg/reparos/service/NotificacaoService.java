package com.sg.reparos.service;

import com.sg.reparos.dto.NotificacaoRequestDTO;
import com.sg.reparos.dto.NotificacaoResponseDTO;
import com.sg.reparos.model.Notificacao;
import com.sg.reparos.model.Usuario;
import com.sg.reparos.repository.NotificacaoRepository;
import com.sg.reparos.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificacaoService {

    private final NotificacaoRepository notificacaoRepository;
    private final UsuarioRepository usuarioRepository;

    public void enviar(NotificacaoRequestDTO dto) {
        Usuario cliente = dto.getClienteId() != null
                ? usuarioRepository.findById(dto.getClienteId())
                        .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"))
                : null;

        Usuario admin = dto.getAdminId() != null
                ? usuarioRepository.findById(dto.getAdminId())
                        .orElseThrow(() -> new IllegalArgumentException("Admin não encontrado"))
                : null;

        Notificacao notificacao = Notificacao.builder()
                .titulo(dto.getTitulo())
                .mensagem(dto.getMensagem())
                .dataCriacao(LocalDateTime.now())
                .cliente(cliente)
                .admin(admin)
                .tipo(dto.getTipo())
                .build();

        notificacaoRepository.save(notificacao);
    }

    public List<NotificacaoResponseDTO> listarPorUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        List<Notificacao> notificacoes = notificacaoRepository
                .findByClienteOrAdminOrderByDataCriacaoDesc(usuario, usuario);

        return notificacoes.stream().map(n -> {
            NotificacaoResponseDTO dto = new NotificacaoResponseDTO();
            dto.setId(n.getId());
            dto.setTitulo(n.getTitulo());
            dto.setMensagem(n.getMensagem());
            dto.setDataCriacao(n.getDataCriacao());
            dto.setClienteId(n.getCliente() != null ? n.getCliente().getId() : null);
            dto.setClienteNome(n.getCliente() != null ? n.getCliente().getNome() : null);
            dto.setAdminId(n.getAdmin() != null ? n.getAdmin().getId() : null);
            dto.setAdminNome(n.getAdmin() != null ? n.getAdmin().getNome() : null);
            dto.setTipo(n.getTipo());
            return dto;
        }).toList();
    }

    public List<NotificacaoResponseDTO> listarRecentes(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        List<Notificacao> notificacoes = notificacaoRepository
                .findTop3ByClienteOrAdminOrderByDataCriacaoDesc(usuario, usuario);

        return notificacoes.stream().map(n -> {
            NotificacaoResponseDTO dto = new NotificacaoResponseDTO();
            dto.setId(n.getId());
            dto.setTitulo(n.getTitulo());
            dto.setMensagem(n.getMensagem());
            dto.setDataCriacao(n.getDataCriacao());
            dto.setClienteId(n.getCliente() != null ? n.getCliente().getId() : null);
            dto.setClienteNome(n.getCliente() != null ? n.getCliente().getNome() : null);
            dto.setAdminId(n.getAdmin() != null ? n.getAdmin().getId() : null);
            dto.setAdminNome(n.getAdmin() != null ? n.getAdmin().getNome() : null);
            dto.setTipo(n.getTipo());
            return dto;
        }).toList();
    }
}
