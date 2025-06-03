package com.sg.reparos.controller;

import com.sg.reparos.dto.ServiceEditDto;
import com.sg.reparos.model.Notification;
import com.sg.reparos.model.Service;
import com.sg.reparos.repository.NotificationRepository;
import com.sg.reparos.repository.ServiceRepository;
import com.sg.reparos.service.ServiceService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/admin/service")
public class AdminServiceController {

    private final ServiceRepository serviceRepository;
    private final ServiceService serviceService;
    private final NotificationRepository notificationRepository;

    public AdminServiceController(ServiceRepository serviceRepository, ServiceService serviceService, NotificationRepository notificationRepository) {
        this.serviceRepository = serviceRepository;
        this.serviceService = serviceService;
        this.notificationRepository = notificationRepository;
    }

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

    @PutMapping("/edit/{id}")
    public ResponseEntity<String> editarServico(@PathVariable Long id, @RequestBody ServiceEditDto updated) {
        serviceService.atualizarAgendamento(id, updated);
        return ResponseEntity.ok("Serviço atualizado com sucesso.");
    }

    @PostMapping("/visit/{id}")
    public ResponseEntity<String> markAsVisited(@PathVariable Long id, @RequestParam Double price) {
        Service service = serviceRepository.findById(id).orElseThrow();
        service.setStatus(Service.ServiceStatus.VISITADO);
        service.setPrice(price);
        serviceRepository.save(service);

        // ✅ Notificação de visita realizada e preço enviado
        Notification notification = new Notification(
                "Visita realizada",
                "O profissional visitou o local e enviou uma proposta de R$ " + String.format("%.2f", price) + " para o serviço de " + service.getServiceType(),
                LocalDateTime.now()
        );
        notificationRepository.save(notification);

        return ResponseEntity.ok("Marcado como visitado.");
    }

    @PostMapping("/complete/{id}")
    public ResponseEntity<String> markAsCompleted(@PathVariable Long id) {
        Service service = serviceRepository.findById(id).orElseThrow();
        service.setStatus(Service.ServiceStatus.FINALIZADO);
        service.setCompletionDate(LocalDate.now());
        serviceRepository.save(service);

        // ✅ Notificação de finalização
        Notification notification = new Notification(
                "Serviço finalizado",
                "Seu serviço de " + service.getServiceType() + " foi finalizado com sucesso.",
                LocalDateTime.now()
        );
        notificationRepository.save(notification);

        return ResponseEntity.ok("Finalizado com sucesso.");
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<Service> cancelService(@PathVariable Long id, @RequestParam String motivo) {
        Service cancelado = serviceService.cancelar(id, motivo);

        // ✅ Notificação de cancelamento
        Notification notification = new Notification(
                "Serviço cancelado",
                "Seu serviço de " + cancelado.getServiceType() + " foi cancelado. Motivo: " + motivo,
                LocalDateTime.now()
        );
        notificationRepository.save(notification);

        return ResponseEntity.ok(cancelado);
    }

    @PutMapping("/agendar/{id}")
    public ResponseEntity<Service> agendarVisita(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate visitDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime visitTime) {

        Service atualizado = serviceService.agendarVisita(id, visitDate, visitTime);
        return ResponseEntity.ok(atualizado);
    }

    @PutMapping("/status/{id}")
    public ResponseEntity<Service> atualizarStatus(
            @PathVariable Long id,
            @RequestParam Service.ServiceStatus status) {

        Service atualizado = serviceService.atualizarStatus(id, status);
        return ResponseEntity.ok(atualizado);
    }
}
