package com.sg.reparos.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notificacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    private String mensagem;

    private LocalDateTime dataCriacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Usuario cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    private Usuario admin;

    @Enumerated(EnumType.STRING)
    private TipoNotificacao tipo;

    public enum TipoNotificacao {
        SOLICITACAO,
        ACEITE,
        RECUSA,
        AGENDAMENTO,
        CONCLUSAO,
        CANCELAMENTO,
        EDICAO,
        AVALIACAO,
        LEMBRETE
    }
}
