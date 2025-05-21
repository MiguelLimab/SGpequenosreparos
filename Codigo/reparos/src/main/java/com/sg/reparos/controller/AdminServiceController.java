package com.sg.reparos.controller;

import com.sg.reparos.dto.ServiceEditDto;
import com.sg.reparos.model.Service;
import com.sg.reparos.repository.ServiceRepository;
import com.sg.reparos.service.ServiceService;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/admin/service")
public class AdminServiceController {

    private final ServiceRepository serviceRepository;
    private final ServiceService serviceService;

    public AdminServiceController(ServiceRepository serviceRepository, ServiceService serviceService) {
        this.serviceRepository = serviceRepository;
        this.serviceService = serviceService;
    }

    // Listar todos com filtros opcionais
    @GetMapping("/api")
    public List<Service> listarServicosAdmin(
            @RequestParam(required = false) Service.ServiceStatus status,
            @RequestParam(required = false) Service.ServiceType type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {

        if (status != null && type != null && dataInicio != null && dataFim != null) {
            return serviceRepository.findByStatusAndServiceTypeAndVisitDateBetween(status, type, dataInicio, dataFim);
        } else if (status != null && type != null) {
            return serviceRepository.findByStatusAndServiceType(status, type);
        } else if (status != null) {
            return serviceRepository.findByStatus(status);
        } else if (type != null) {
            return serviceRepository.findByServiceType(type);
        } else if (dataInicio != null && dataFim != null) {
            return serviceRepository.findByVisitDateBetween(dataInicio, dataFim);
        } else {
            return serviceRepository.findAll();
        }
    }

    // Editar serviço (atualização completa)
    @PutMapping("/edit/{id}")
    public ResponseEntity<String> editarServico(@PathVariable Long id, @RequestBody ServiceEditDto updated) {
        serviceService.atualizarAgendamento(id, updated);
        return ResponseEntity.ok("Serviço atualizado com sucesso.");
    }

    // Marcar como visitado
    @PostMapping("/visit/{id}")
    public ResponseEntity<String> markAsVisited(@PathVariable Long id, @RequestParam Double price) {
        Service service = serviceRepository.findById(id).orElseThrow();
        service.setStatus(Service.ServiceStatus.VISITADO);
        service.setPrice(price);
        serviceRepository.save(service);
        return ResponseEntity.ok("Marcado como visitado.");
    }

    // Marcar como finalizado
    @PostMapping("/complete/{id}")
    public ResponseEntity<String> markAsCompleted(@PathVariable Long id) {
        Service service = serviceRepository.findById(id).orElseThrow();
        service.setStatus(Service.ServiceStatus.FINALIZADO);
        service.setCompletionDate(LocalDate.now());
        serviceRepository.save(service);
        return ResponseEntity.ok("Finalizado com sucesso.");
    }

    // Cancelar serviço com motivo
    @PutMapping("/cancel/{id}")
    public ResponseEntity<Service> cancelService(@PathVariable Long id, @RequestParam String motivo) {
        Service cancelado = serviceService.cancelar(id, motivo);
        return ResponseEntity.ok(cancelado);
    }

    // Agendar visita
    @PutMapping("/agendar/{id}")
    public ResponseEntity<Service> agendarVisita(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate visitDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime visitTime) {

        Service atualizado = serviceService.agendarVisita(id, visitDate, visitTime);
        return ResponseEntity.ok(atualizado);
    }

    // Atualizar status
    @PutMapping("/status/{id}")
    public ResponseEntity<Service> atualizarStatus(
            @PathVariable Long id,
            @RequestParam Service.ServiceStatus status) {

        Service atualizado = serviceService.atualizarStatus(id, status);
        return ResponseEntity.ok(atualizado);
    }
}
