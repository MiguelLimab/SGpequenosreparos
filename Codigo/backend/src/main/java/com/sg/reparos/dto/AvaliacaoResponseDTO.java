package com.sg.reparos.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AvaliacaoResponseDTO {
    private Long id;
    private int nota;
    private String comentario;
    private LocalDateTime dataAvaliacao;
    private Long servicoId;
    private Long clienteId;
    private String clienteNome;
}
