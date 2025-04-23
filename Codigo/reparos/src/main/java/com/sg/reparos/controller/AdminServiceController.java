package com.sg.reparos.controller;

import com.sg.reparos.model.Service;
import com.sg.reparos.repository.ServiceRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

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

}