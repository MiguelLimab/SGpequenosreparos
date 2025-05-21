package com.sg.reparos.controller;

import com.sg.reparos.dto.ServiceEditDto;
import com.sg.reparos.model.Service;
import com.sg.reparos.repository.ServiceRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin/service")
public class AdminServiceController {
    private final ServiceRepository serviceRepository;

    public AdminServiceController(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    @GetMapping("/api")
    public List<Service> listarServicosAdmin(
            @RequestParam(required = false) Service.ServiceStatus status,
            @RequestParam(required = false) Service.ServiceType type) {
        if (status != null && type != null) {
            return serviceRepository.findByStatusAndServiceType(status, type);
        } else if (status != null) {
            return serviceRepository.findByStatus(status);
        } else if (type != null) {
            return serviceRepository.findByServiceType(type);
        } else {
            return serviceRepository.findAll();
        }
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<String> editarServico(@PathVariable Long id, @RequestBody ServiceEditDto updated) {
        Optional<Service> optional = serviceRepository.findById(id);
        if (optional.isEmpty()) return ResponseEntity.notFound().build();

        Service original = optional.get();
        original.setServiceType(Service.ServiceType.valueOf(updated.getServiceType()));
        original.setLocation(updated.getLocation());
        original.setDescription(updated.getDescription());
        original.setVisitDate(updated.getVisitDate());
        original.setVisitTime(updated.getVisitTime());
        original.setCompletionDate(updated.getCompletionDate());
        original.setCompletionTime(updated.getCompletionTime());
        original.setStatus(updated.getStatus());
        original.setPrice(updated.getPrice());
        original.setEstimatedDuration(updated.getEstimatedDuration());
        original.setOrcamentoStatus(updated.getOrcamentoStatus());

        serviceRepository.save(original);
        return ResponseEntity.ok("Serviço atualizado com sucesso.");
    }

    @PostMapping("/visit/{id}")
    public ResponseEntity<?> markAsVisited(@PathVariable Long id, @RequestParam Double price) {
        Service service = serviceRepository.findById(id).orElseThrow();
        service.setStatus(Service.ServiceStatus.VISITADO);
        service.setPrice(price);
        serviceRepository.save(service);
        return ResponseEntity.ok("Marcado como visitado");
    }

    @PostMapping("/complete/{id}")
    public ResponseEntity<?> markAsCompleted(@PathVariable Long id) {
        Service service = serviceRepository.findById(id).orElseThrow();
        service.setStatus(Service.ServiceStatus.FINALIZADO);
        service.setCompletionDate(LocalDate.now());
        serviceRepository.save(service);
        return ResponseEntity.ok("Finalizado com sucesso");
    }

    @PostMapping("/cancel/{id}")
    public ResponseEntity<?> cancelService(@PathVariable Long id) {
        Service service = serviceRepository.findById(id).orElseThrow();
        service.setStatus(Service.ServiceStatus.CANCELADO);
        serviceRepository.save(service);
        return ResponseEntity.ok("Cancelado com sucesso");
    }
}
