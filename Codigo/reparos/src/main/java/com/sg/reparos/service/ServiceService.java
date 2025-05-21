package com.sg.reparos.service;

import com.sg.reparos.dto.ServiceEditDto;
import com.sg.reparos.dto.ServiceDto;
import com.sg.reparos.model.Service;
import com.sg.reparos.repository.ServiceRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

// Correção: Evita conflito com com.sg.reparos.model.Service
@org.springframework.stereotype.Service
public class ServiceService {

    private final ServiceRepository serviceRepository;

    public ServiceService(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    /**
     * Buscar todos os serviços/agendamentos.
     */
    public List<ServiceDto> buscarTodos() {
        return serviceRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Atualizar agendamento completo.
     */
    public void atualizarAgendamento(Long id, ServiceEditDto dto) {
        Service agendamento = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        agendamento.setServiceType(Service.ServiceType.valueOf(dto.getServiceType())); // assumindo String
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

    /**
     * Agendar uma visita.
     */
    public Service agendarVisita(Long id, LocalDate visitDate, LocalTime visitTime) {
        validarDataPermitida(visitDate);

        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        service.setVisitDate(visitDate);
        service.setVisitTime(visitTime);
        service.setStatus(Service.ServiceStatus.AGENDAMENTO_VISITA);
        return serviceRepository.save(service);
    }

    /**
     * Atualizar o status do serviço.
     */
    public Service atualizarStatus(Long id, Service.ServiceStatus status) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        service.setStatus(status);
        return serviceRepository.save(service);
    }

    /**
     * Cancelar um serviço, adicionando motivo.
     */
    public Service cancelar(Long id, String motivo) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        service.setStatus(Service.ServiceStatus.CANCELADO);
        service.setMotivoCancelamento(motivo);
        return serviceRepository.save(service);
    }

    /**
     * Validação da regra de "4 dias sim, 4 dias não".
     */
    public boolean isDataPermitida(LocalDate data) {
        LocalDate inicio = LocalDate.of(2025, 1, 1); // Data base
        long diasDiferenca = ChronoUnit.DAYS.between(inicio, data);
        long ciclo = diasDiferenca % 8;
        return ciclo >= 0 && ciclo <= 3; // 4 dias sim
    }

    /**
     * Método para validar e lançar exceção se a data não for permitida.
     */
    public void validarDataPermitida(LocalDate data) {
        if (!isDataPermitida(data)) {
            throw new IllegalArgumentException("A data selecionada está em um período não permitido para agendamentos (4 dias sim, 4 dias não).");
        }
    }

    /**
     * Conversão de entidade para DTO.
     */
    private ServiceDto toDto(Service servico) {
        ServiceDto dto = new ServiceDto();
        dto.setId(servico.getId());
        dto.setServiceType(servico.getServiceType().name());
        dto.setLocation(servico.getLocation());
        dto.setDescription(servico.getDescription());
        dto.setVisitDate(servico.getVisitDate());
        dto.setVisitTime(servico.getVisitTime());
        dto.setStatus(servico.getStatus().name());
        dto.setCompletionDate(servico.getCompletionDate());
        dto.setCompletionTime(servico.getCompletionTime());
        dto.setPrice(servico.getPrice());
        return dto;
    }
}
