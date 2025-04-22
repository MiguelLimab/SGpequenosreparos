package com.sg.reparos.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ServiceDto {
    private String serviceType;
    private String location;
    private String description;
    private LocalDate visitDate;
    private LocalTime visitTime;
    private LocalDate completionDate;
    private LocalTime completionTime;
}