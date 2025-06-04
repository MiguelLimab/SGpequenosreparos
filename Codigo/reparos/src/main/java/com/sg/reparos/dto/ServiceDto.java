package com.sg.reparos.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.sg.reparos.model.Service;

import lombok.Data;

@Data
public class ServiceDto {
    private Long id; 
    private String serviceType;
    private String location;
    private String description;
    private LocalDate visitDate;
    private LocalTime visitTime;
    private String status; 
    private LocalDate completionDate;
    private LocalTime completionTime;
    private Double price; 
    private Boolean temFeedback;
    private Integer notaFeedback;
    private String comentarioFeedback;
    private Boolean podeReceberFeedback;
}
