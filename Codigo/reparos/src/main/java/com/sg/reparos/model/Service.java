package com.sg.reparos.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Entity

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
    private ServiceType serviceType;
    
    private String location;
    private String description;
    
    @Enumerated(EnumType.STRING)
    private ServiceStatus status;
    
    private LocalDate visitDate;
    private LocalTime visitTime;
    
    private LocalDate completionDate;
    private LocalTime completionTime;
    
    private Double price;
    private Integer estimatedDuration;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}