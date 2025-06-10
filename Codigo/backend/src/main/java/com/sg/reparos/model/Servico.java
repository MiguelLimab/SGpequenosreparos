package com.sg.reparos.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "servicos")
public class Servico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String descricao;

    @ManyToOne
    @JoinColumn(name = "tipo_servico_id", nullable = false)
    private TipoServico tipoServico;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Usuario cliente;

    @ManyToOne
    @JoinColumn(name = "administrador_id")
    private Usuario administrador; // Só preenchido quando aceito

    @Column(nullable = false)
    private String emailContato;

    @Column(nullable = false)
    private String telefoneContato;

    // Disponibilidade informada pelo cliente
    @ElementCollection
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "servico_dias_disponiveis", joinColumns = @JoinColumn(name = "servico_id"))
    @Column(name = "dia_semana")
    private List<DiaSemana> diasDisponiveisCliente;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Periodo periodoDisponivelCliente;

    private LocalDate data; // Data agendada (preenchida pelo admin)

    private LocalTime horario; // Horário agendado (preenchido pelo admin)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusServico status;

    private String motivoCancelamento; // Motivo preenchido quando cancelado

    // Enum para o status do serviço
    public enum StatusServico {
        SOLICITADO,
        ACEITO,
        RECUSADO,
        CANCELADO,
        CONCLUIDO
    }

    // Enum para o dia da semana
    public enum DiaSemana {
        SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO, DOMINGO
    }

    // Enum para o período do dia
    public enum Periodo {
        MANHA, TARDE, NOITE
    }

    @OneToOne(mappedBy = "servico", cascade = CascadeType.ALL)
    private Avaliacao avaliacao;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public TipoServico getTipoServico() {
        return tipoServico;
    }

    public void setTipoServico(TipoServico tipoServico) {
        this.tipoServico = tipoServico;
    }

    public Usuario getCliente() {
        return cliente;
    }

    public void setCliente(Usuario cliente) {
        this.cliente = cliente;
    }

    public Usuario getAdministrador() {
        return administrador;
    }

    public void setAdministrador(Usuario administrador) {
        this.administrador = administrador;
    }

    public String getEmailContato() {
        return emailContato;
    }

    public void setEmailContato(String emailContato) {
        this.emailContato = emailContato;
    }

    public String getTelefoneContato() {
        return telefoneContato;
    }

    public void setTelefoneContato(String telefoneContato) {
        this.telefoneContato = telefoneContato;
    }

    public List<DiaSemana> getDiasDisponiveisCliente() {
        return diasDisponiveisCliente;
    }

    public void setDiasDisponiveisCliente(List<DiaSemana> diasDisponiveisCliente) {
        this.diasDisponiveisCliente = diasDisponiveisCliente;
    }

    public Periodo getPeriodoDisponivelCliente() {
        return periodoDisponivelCliente;
    }

    public void setPeriodoDisponivelCliente(Periodo periodoDisponivelCliente) {
        this.periodoDisponivelCliente = periodoDisponivelCliente;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public LocalTime getHorario() {
        return horario;
    }

    public void setHorario(LocalTime horario) {
        this.horario = horario;
    }

    public StatusServico getStatus() {
        return status;
    }

    public void setStatus(StatusServico status) {
        this.status = status;
    }

    public String getMotivoCancelamento() {
        return motivoCancelamento;
    }

    public void setMotivoCancelamento(String motivoCancelamento) {
        this.motivoCancelamento = motivoCancelamento;
    }

    // Getters e Setters

}
