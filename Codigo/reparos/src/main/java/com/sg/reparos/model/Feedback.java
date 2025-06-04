package com.sg.reparos.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
public class Feedback {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Integer nota; // De 1 a 5 estrelas
    
    @Column(columnDefinition = "TEXT")
    private String comentario;
    
    @Column(nullable = false)
    private LocalDateTime dataAvaliacao;
    
    @OneToOne
    @JoinColumn(name = "service_id", nullable = false, unique = true)
    private Service service;
    
    @PrePersist
    protected void onCreate() {
        dataAvaliacao = LocalDateTime.now();
    }
    
    // Construtor padrão
    public Feedback() {}
    
    // Construtor com parâmetros
    public Feedback(Integer nota, String comentario, Service service) {
        this.setNota(nota);
        this.comentario = comentario;
        this.service = service;
    }
    
    // Getters e Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Integer getNota() {
        return nota;
    }
    
    // Método para validar a nota
    public void setNota(Integer nota) {
        if (nota == null || nota < 1 || nota > 5) {
            throw new IllegalArgumentException("A nota deve estar entre 1 e 5");
        }
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
    
    public Service getService() {
        return service;
    }
    
    public void setService(Service service) {
        this.service = service;
    }
    
    // Métodos equals e hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
        Feedback feedback = (Feedback) o;
        
        if (id != null ? !id.equals(feedback.id) : feedback.id != null) return false;
        return service != null ? service.equals(feedback.service) : feedback.service == null;
    }
    
    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (service != null ? service.hashCode() : 0);
        return result;
    }
    
    // Método toString
    @Override
    public String toString() {
        return "Feedback{" +
                "id=" + id +
                ", nota=" + nota +
                ", comentario='" + comentario + '\'' +
                ", dataAvaliacao=" + dataAvaliacao +
                ", serviceId=" + (service != null ? service.getId() : null) +
                '}';
    }
}