package com.sg.reparos.dto;

import lombok.Data;

@Data
public class TipoServicoResponse {

    private Long id;
    private String nome;
    private String descricao;
    private Integer duracao;
}
