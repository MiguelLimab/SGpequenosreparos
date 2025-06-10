package com.sg.reparos.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TipoServicoRequest {

    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    private String descricao;

    @NotNull(message = "A duração é obrigatória")
    @Min(value = 1, message = "A duração deve ser no mínimo 1 minuto")
    private Integer duracao; // duração em minutos
}
