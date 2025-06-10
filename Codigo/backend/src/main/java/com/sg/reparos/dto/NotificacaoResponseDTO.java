package com.sg.reparos.dto;

import com.sg.reparos.model.Notificacao.TipoNotificacao;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class NotificacaoResponseDTO {
    private Long id;
    private String titulo;
    private String mensagem;
    private LocalDateTime dataCriacao;
    private Long clienteId;
    private String clienteNome;
    private Long adminId;
    private String adminNome;
    private TipoNotificacao tipo;
}
