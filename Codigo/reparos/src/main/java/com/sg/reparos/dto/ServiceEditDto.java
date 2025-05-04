package com.sg.reparos.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.sg.reparos.model.Service;

import lombok.Data;

@Data
public class ServiceEditDto {
    private String serviceType;
    private String location;
    private String description;
    private LocalDate visitDate;
    private LocalTime visitTime;
    private LocalDate completionDate;
    private LocalTime completionTime;
    private Service.ServiceStatus status;
    private Double price;
    private String estimatedDuration;
}

