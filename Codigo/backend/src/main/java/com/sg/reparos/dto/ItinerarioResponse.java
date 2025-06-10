package com.sg.reparos.dto;

import com.sg.reparos.model.Itinerario.TipoItinerario;
import lombok.Data;

import java.time.LocalTime;
import java.util.Set;

@Data
public class ItinerarioResponse {

    private Long id;

    private Long profissionalId;

    private String profissionalNome;

    private TipoItinerario tipoItinerario;

    private Set<Integer> diasSemana;

    private Integer diasTrabalho;

    private Integer diasFolga;

    private LocalTime horaInicio;

    private LocalTime horaFim;
}
