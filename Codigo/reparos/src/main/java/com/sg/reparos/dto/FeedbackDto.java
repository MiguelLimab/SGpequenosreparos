package com.sg.reparos.dto;

import java.time.LocalDateTime;

public class FeedbackDto {
    private Long id;
    private Long serviceId;
    private Integer nota;
    private String comentario;
    private LocalDateTime dataAvaliacao;
    
    // Construtor padrão
    public FeedbackDto() {}
    
    // Construtor com parâmetros
    public FeedbackDto(Long id, Long serviceId, Integer nota, String comentario, LocalDateTime dataAvaliacao) {
        this.id = id;
        this.serviceId = serviceId;
        this.nota = nota;
        this.comentario = comentario;
        this.dataAvaliacao = dataAvaliacao;
    }
    
    // Getters e Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getServiceId() {
        return serviceId;
    }
    
    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }
    
    public Integer getNota() {
        return nota;
    }
    
    public void setNota(Integer nota) {
        this.nota = nota;
    }
    
    public String getComentario() {
        return comentario;
    }
    
    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
    
    public LocalDateTime getDataAvaliacao() {
        return dataAvaliacao;
    }
    
    public void setDataAvaliacao(LocalDateTime dataAvaliacao) {
        this.dataAvaliacao = dataAvaliacao;
    }
    
    // Métodos equals e hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
        FeedbackDto that = (FeedbackDto) o;
        
        if (id != null ? !id.equals(that.id) : that.id != null) return false;
        return serviceId != null ? serviceId.equals(that.serviceId) : that.serviceId == null;
    }
    
    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (serviceId != null ? serviceId.hashCode() : 0);
        return result;
    }
    
    // Método toString
    @Override
    public String toString() {
        return "FeedbackDto{" +
                "id=" + id +
                ", serviceId=" + serviceId +
                ", nota=" + nota +
                ", comentario='" + comentario + '\'' +
                ", dataAvaliacao=" + dataAvaliacao +
                '}';
    }
}