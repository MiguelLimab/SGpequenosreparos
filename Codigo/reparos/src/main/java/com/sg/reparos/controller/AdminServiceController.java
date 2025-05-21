package com.sg.reparos.controller;


import com.sg.reparos.dto.ServiceEditDto;
import com.sg.reparos.model.Service;
import com.sg.reparos.repository.ServiceRepository;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/admin/service")
public class AdminServiceController {
    private final ServiceRepository serviceRepository;

    public AdminServiceController(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    @GetMapping
    public String adminServicePage(
            @RequestParam(required = false) Service.ServiceStatus status,
            @RequestParam(required = false) Service.ServiceType type,
            Model model) {

        List<Service> services;

        if (status != null && type != null) {
            services = serviceRepository.findByStatusAndServiceType(status, type);
        } else if (status != null) {
            services = serviceRepository.findByStatus(status);
        } else if (type != null) {
            services = serviceRepository.findByServiceType(type);
        } else {
            services = serviceRepository.findAll();
        }

        model.addAttribute("services", services);
        return "admin/service";
    }

    @PostMapping("/visit/{id}")
    public String markAsVisited(@PathVariable Long id, @RequestParam Double price) {
        Service service = serviceRepository.findById(id).orElseThrow();
        service.setStatus(Service.ServiceStatus.VISITADO);
        service.setPrice(price);
        serviceRepository.save(service);
        return "redirect:/admin/service";
    }

    @PostMapping("/complete/{id}")
    public String markAsCompleted(@PathVariable Long id) {
        Service service = serviceRepository.findById(id).orElseThrow();
        service.setStatus(Service.ServiceStatus.FINALIZADO);
        service.setCompletionDate(LocalDate.now());
        serviceRepository.save(service);
        return "redirect:/admin/service";
    }

    @PostMapping("/cancel/{id}")
    public String cancelService(@PathVariable Long id) {
        Service service = serviceRepository.findById(id).orElseThrow();
        service.setStatus(Service.ServiceStatus.CANCELADO);
        serviceRepository.save(service);
        return "redirect:/admin/service";
    }

    @PostMapping("/confirm-completion/{id}")
    public String confirmCompletion(@PathVariable Long id) {
        Optional<Service> serviceOptional = serviceRepository.findById(id);
        if (serviceOptional.isPresent()) {
            Service service = serviceOptional.get();
            service.setStatus(Service.ServiceStatus.FINALIZADO);
            serviceRepository.save(service);
        }
        return "redirect:/admin/service";
    }

    @GetMapping("/api/admin")
    @ResponseBody
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

@GetMapping("/api")
public List<Service> listarServicos(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {

    // Nenhum filtro: retorna tudo
    if (status == null && dataInicio == null && dataFim == null) {
        return serviceRepository.findAll();
    }

    // Se status for informado
    if (status != null && dataInicio != null && dataFim != null) {
        try {
            Service.ServiceStatus enumStatus = Service.ServiceStatus.valueOf(status.toUpperCase());
            return serviceRepository.findByStatusAndVisitDateBetween(enumStatus, dataInicio, dataFim);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status inválido: " + status);
        }
    }

    // Adicione outras combinações conforme necessário

    return List.of(); // retorna vazio se não for possível atender a requisição
}


    @PutMapping("/edit/{id}")
    @ResponseBody
    public ResponseEntity<String> editarServico(@PathVariable Long id, @RequestBody ServiceEditDto updated) {
        Optional<Service> optional = serviceRepository.findById(id);
        if (optional.isEmpty())
            return ResponseEntity.notFound().build();

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

}