package com.sg.reparos.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AvaliacaoRequestDTO {
    private Long servicoId;
    private Long clienteId;
    private int nota;
    private String comentario;
}
