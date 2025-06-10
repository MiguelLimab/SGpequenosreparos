package com.sg.reparos.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tipo_servico")
@Data
public class TipoServico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    @Column(length = 255)
    private String descricao;

    @Column(nullable = false)
    private Integer duracao; // duração em minutos
}
