package com.sg.reparos.service;

import com.sg.reparos.dto.ServiceEditDto;
import com.sg.reparos.dto.ServiceDto;
import com.sg.reparos.model.Service; // Usa explicitamente o model.Service
import com.sg.reparos.repository.ServiceRepository;

import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service // evita conflito com com.sg.reparos.model.Service
public class ServiceService {

    private final ServiceRepository serviceRepository;

    public ServiceService(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    public List<ServiceDto> buscarTodos() {
        return serviceRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public void atualizarAgendamento(Long id, ServiceEditDto dto) {
        Service agendamento = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        agendamento.setServiceType(Service.ServiceType.valueOf(dto.getServiceType())); // converte String para enum
        agendamento.setLocation(dto.getLocation());
        agendamento.setDescription(dto.getDescription());
        agendamento.setVisitDate(dto.getVisitDate());
        agendamento.setVisitTime(dto.getVisitTime());
        agendamento.setCompletionDate(dto.getCompletionDate());
        agendamento.setCompletionTime(dto.getCompletionTime());
        agendamento.setStatus(dto.getStatus());
        agendamento.setPrice(dto.getPrice());
        agendamento.setEstimatedDuration(dto.getEstimatedDuration());
        agendamento.setOrcamentoStatus(dto.getOrcamentoStatus());

        serviceRepository.save(agendamento);
    }

    private ServiceDto toDto(Service servico) {
        ServiceDto dto = new ServiceDto();
        dto.setId(servico.getId());
        dto.setServiceType(servico.getServiceType().name()); // enum -> String
        dto.setLocation(servico.getLocation());
        dto.setDescription(servico.getDescription());
        dto.setVisitDate(servico.getVisitDate());
        dto.setVisitTime(servico.getVisitTime());
        dto.setStatus(servico.getStatus().name()); // enum -> String
        dto.setCompletionDate(servico.getCompletionDate());
        dto.setCompletionTime(servico.getCompletionTime());
        dto.setPrice(servico.getPrice());
        return dto;
    }
}
