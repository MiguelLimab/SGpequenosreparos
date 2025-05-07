package com.sg.reparos.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Data
public class Service {

    public enum ServiceType {
        ELETRICO, ENCANAMENTO, PINTURA, ALVENARIA, OUTROS
    }

    public enum ServiceStatus {
        AGENDAMENTO_VISITA,
        VISITADO,
        AGENDAMENTO_FINALIZACAO,
        AGUARDANDO_FINALIZACAO,
        FINALIZADO,
        CANCELADO,
        REJEITADO
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ServiceType serviceType;

    @Column(nullable = false)
    private String location;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ServiceStatus status;

    private LocalDate visitDate;
    private LocalTime visitTime;

    private LocalDate completionDate;
    private LocalTime completionTime;

    private Double price;

    private String estimatedDuration;
    private String orcamentoStatus;

    @Column(length = 300)
    private String motivoCancelamento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
