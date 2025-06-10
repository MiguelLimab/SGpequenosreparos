package com.sg.reparos.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.sg.reparos.model.Itinerario.TipoItinerario;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalTime;
import java.util.Set;

@Data
public class ItinerarioRequest {

    @NotNull(message = "Tipo de itinerário é obrigatório")
    private TipoItinerario tipoItinerario;

    // Usado quando tipoItinerario == FIXO
    private Set<@Min(1) @Max(7) Integer> diasSemana;

    // Usados quando tipoItinerario == CICLICO
    @Min(value = 1, message = "Dias de trabalho devem ser no mínimo 1")
    private Integer diasTrabalho;

    @Min(value = 1, message = "Dias de folga devem ser no mínimo 1")
    private Integer diasFolga;

    @JsonFormat(pattern = "HH:mm:ss")
    @NotNull(message = "Hora de início é obrigatória")
    private LocalTime horaInicio;
    
    @JsonFormat(pattern = "HH:mm:ss")
    @NotNull(message = "Hora de término é obrigatória")
    private LocalTime horaFim;
}
