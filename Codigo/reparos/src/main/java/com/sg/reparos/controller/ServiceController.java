package com.sg.reparos.controller;

import com.sg.reparos.dto.ServiceDto;
import com.sg.reparos.model.Service;
import com.sg.reparos.model.User;
import com.sg.reparos.repository.ServiceRepository;
import com.sg.reparos.service.UserService;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/service")
public class ServiceController {
    private final ServiceRepository serviceRepository;
    private final UserService userService;

    public ServiceController(ServiceRepository serviceRepository, UserService userService) {
        this.serviceRepository = serviceRepository;
        this.userService = userService;
    }

    @GetMapping
    public String servicePage(@RequestParam(required = false) Service.ServiceStatus status, Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> userOptional = userService.findByUsername(auth.getName());

        if (userOptional.isEmpty()) {
            return "redirect:/login";
        }

        User user = userOptional.get();
        List<Service> services;

        if (status != null) {
            services = serviceRepository.findByUserAndStatus(user, status);
        } else {
            services = serviceRepository.findByUser(user);
        }

        model.addAttribute("services", services);
        return "service";
    }

    @PostMapping("/new")
    public String createService(@ModelAttribute ServiceDto serviceDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> userOptional = userService.findByUsername(auth.getName());

        if (userOptional.isEmpty()) {
            return "redirect:/login";
        }

        User user = userOptional.get();
        Service service = new Service();
        service.setServiceType(Service.ServiceType.valueOf(serviceDto.getServiceType()));
        service.setLocation(serviceDto.getLocation());
        service.setDescription(serviceDto.getDescription());
        service.setVisitDate(serviceDto.getVisitDate());
        service.setVisitTime(serviceDto.getVisitTime());
        service.setStatus(Service.ServiceStatus.AGENDAMENTO_VISITA);
        service.setUser(user);

        serviceRepository.save(service);
        return "redirect:/service";
    }

    @PostMapping("/cancel/{id}")
    public String cancelService(@PathVariable Long id) {
        Optional<Service> serviceOptional = serviceRepository.findById(id);
        if (serviceOptional.isPresent()) {
            Service service = serviceOptional.get();
            service.setStatus(Service.ServiceStatus.CANCELADO);
            serviceRepository.save(service);
        }
        return "redirect:/service";
    }

    @PostMapping("/accept/{id}")
    public String acceptPrice(@PathVariable Long id) {
        Optional<Service> serviceOptional = serviceRepository.findById(id);
        if (serviceOptional.isPresent()) {
            Service service = serviceOptional.get();
            service.setStatus(Service.ServiceStatus.AGENDAMENTO_FINALIZACAO);
            serviceRepository.save(service);
        }
        return "redirect:/service";
    }

    @PostMapping("/reject/{id}")
    public String rejectPrice(@PathVariable Long id) {
        Optional<Service> serviceOptional = serviceRepository.findById(id);
        if (serviceOptional.isPresent()) {
            Service service = serviceOptional.get();
            service.setStatus(Service.ServiceStatus.REJEITADO);
            serviceRepository.save(service);
        }
        return "redirect:/service";
    }

    @PostMapping("/reschedule/{id}")
    public String rescheduleCompletion(@PathVariable Long id,
            @RequestParam("completionDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam("completionTime") @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime time) {

        Optional<Service> serviceOptional = serviceRepository.findById(id);
        if (serviceOptional.isPresent()) {
            Service service = serviceOptional.get();

            if (date.isBefore(service.getVisitDate())) {
                return "redirect:/service?error=Completion date cannot be before visit date";
            }

            service.setCompletionDate(date);
            service.setCompletionTime(time);
            service.setStatus(Service.ServiceStatus.AGUARDANDO_FINALIZACAO);
            serviceRepository.save(service);
        }

        return "redirect:/service";
    }

    
    @GetMapping("/api/service")
    @ResponseBody
    public List<Service> listarServicosDoUsuario(Authentication authentication) {
        Optional<User> userOptional = userService.findByUsername(authentication.getName());
        if (userOptional.isPresent()) {
            return serviceRepository.findByUser(userOptional.get());
        }
        return List.of(); // Lista vazia se não estiver autenticado
    }
}