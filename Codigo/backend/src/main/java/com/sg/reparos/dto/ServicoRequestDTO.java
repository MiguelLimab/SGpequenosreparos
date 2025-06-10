package com.sg.reparos.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class ServicoRequestDTO {

    @NotBlank(message = "O nome do serviço é obrigatório.")
    private String nome;

    @NotBlank(message = "A descrição do serviço é obrigatória.")
    private String descricao;

    @NotNull(message = "O tipo de serviço deve ser informado.")
    private Long tipoServicoId;

    @NotNull(message = "O ID do cliente é obrigatório.")
    private Long clienteId;

    @NotBlank(message = "O e-mail de contato é obrigatório.")
    @Email(message = "O e-mail informado é inválido.")
    private String emailContato;

    @NotBlank(message = "O telefone de contato é obrigatório.")
    private String telefoneContato;

    @NotEmpty(message = "Informe ao menos um dia de disponibilidade.")
    private List<String> diasDisponiveisCliente;

    @NotBlank(message = "O período disponível deve ser informado.")
    private String periodoDisponivelCliente;

    // Campos opcionais para edição
    private LocalDate data;
    private LocalTime horario;
    private String status;

    // Getters e Setters
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public Long getTipoServicoId() { return tipoServicoId; }
    public void setTipoServicoId(Long tipoServicoId) { this.tipoServicoId = tipoServicoId; }

    public Long getClienteId() { return clienteId; }
    public void setClienteId(Long clienteId) { this.clienteId = clienteId; }

    public String getEmailContato() { return emailContato; }
    public void setEmailContato(String emailContato) { this.emailContato = emailContato; }

    public String getTelefoneContato() { return telefoneContato; }
    public void setTelefoneContato(String telefoneContato) { this.telefoneContato = telefoneContato; }

    public List<String> getDiasDisponiveisCliente() { return diasDisponiveisCliente; }
    public void setDiasDisponiveisCliente(List<String> diasDisponiveisCliente) {
        this.diasDisponiveisCliente = diasDisponiveisCliente;
    }

    public String getPeriodoDisponivelCliente() { return periodoDisponivelCliente; }
    public void setPeriodoDisponivelCliente(String periodoDisponivelCliente) {
        this.periodoDisponivelCliente = periodoDisponivelCliente;
    }

    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }

    public LocalTime getHorario() { return horario; }
    public void setHorario(LocalTime horario) { this.horario = horario; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
