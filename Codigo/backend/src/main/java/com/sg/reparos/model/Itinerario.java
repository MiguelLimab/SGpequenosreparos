package com.sg.reparos.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalTime;
import java.util.Set;

@Entity
@Table(name = "itinerario")
@Data
public class Itinerario {

    public enum TipoItinerario {
        FIXO,
        CICLICO
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Associação com usuário profissional/admin
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario profissional;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoItinerario tipoItinerario;

    // Para FIXO: dias da semana ativos (1=Domingo, ..., 7=Sábado)
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "itinerario_dias", joinColumns = @JoinColumn(name = "itinerario_id"))
    @Column(name = "dia_semana")
    private Set<Integer> diasSemana;

    // Para CICLICO: dias consecutivos de trabalho
    @Column(nullable = true)
    private Integer diasTrabalho;

    // Para CICLICO: dias consecutivos de folga
    @Column(nullable = true)
    private Integer diasFolga;

    // Horários de expediente
    @Column(nullable = false)
    private LocalTime horaInicio;

    @Column(nullable = false)
    private LocalTime horaFim;
}
