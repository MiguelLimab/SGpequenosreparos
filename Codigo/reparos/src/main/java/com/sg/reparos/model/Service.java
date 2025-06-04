package com.sg.reparos.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Entidade que representa um serviço, incluindo agendamento, execução e finalização.
 */
@Data
@Entity
public class Service {

    /**
     * Tipos de serviço disponíveis.
     */
    public enum ServiceType {
        ELETRICO, ENCANAMENTO, PINTURA, ALVENARIA, OUTROS
    }

    /**
     * Status de execução e agendamento do serviço.
     */
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

    public Long getId() {
        return id;
    }
    
    @Enumerated(EnumType.STRING)
    private ServiceType serviceType;

    private String location;

    private String description;

    @Enumerated(EnumType.STRING)
    private ServiceStatus status;

    /**
     * Data e hora da visita agendada.
     */
    private LocalDate visitDate;
    private LocalTime visitTime;

    /**
     * Data e hora de finalização prevista.
     */
    private LocalDate completionDate;
    private LocalTime completionTime;

    /**
     * Informações financeiras e de planejamento.
     */
    private Double price;
    private String estimatedDuration;
    private String orcamentoStatus;

    /**
     * Motivo de cancelamento, se aplicável.
     */
    private String motivoCancelamento;

    /**
     * Usuário associado ao serviço.
     */
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @JsonIgnore
    @OneToOne(mappedBy = "service", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Feedback feedback;
}
