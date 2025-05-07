package com.sg.reparos.controller;

import com.sg.reparos.dto.ServiceDto;
import com.sg.reparos.model.Service;
import com.sg.reparos.model.User;
import com.sg.reparos.repository.ServiceRepository;
import com.sg.reparos.service.UserService;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
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

    // Página principal do usuário com serviços listados (filtrando por status opcionalmente)
    @GetMapping
    public String servicePage(@RequestParam(required = false) Service.ServiceStatus status, Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> userOptional = userService.findByUsername(auth.getName());

        if (userOptional.isEmpty()) {
            return "redirect:/login";
        }

        User user = userOptional.get();
        List<Service> services = (status != null)
                ? serviceRepository.findByUserAndStatus(user, status)
                : serviceRepository.findByUser(user);

        model.addAttribute("services", services);
        return "service";
    }

    // Criação de novo serviço (verifica data/hora e conflito de agendamento)
    @PostMapping("/new")
    public ResponseEntity<String> createService(@ModelAttribute ServiceDto serviceDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> userOptional = userService.findByUsername(auth.getName());

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado.");
        }

        LocalDate visitDate = serviceDto.getVisitDate();
        LocalTime visitTime = serviceDto.getVisitTime();

        if (visitDate.isBefore(LocalDate.now()) ||
                (visitDate.isEqual(LocalDate.now()) && visitTime.isBefore(LocalTime.now()))) {
            return ResponseEntity.badRequest().body("A data e hora da visita não podem estar no passado.");
        }

        if (serviceRepository.existsByVisitDateAndVisitTime(visitDate, visitTime)) {
            return ResponseEntity.badRequest().body("Já existe um serviço agendado nesse horário.");
        }

        User user = userOptional.get();
        Service service = new Service();
        service.setServiceType(Service.ServiceType.valueOf(serviceDto.getServiceType()));
        service.setLocation(serviceDto.getLocation());
        service.setDescription(serviceDto.getDescription());
        service.setVisitDate(visitDate);
        service.setVisitTime(visitTime);
        service.setStatus(Service.ServiceStatus.AGENDAMENTO_VISITA);
        service.setUser(user);

        serviceRepository.save(service);
        return ResponseEntity.ok("Serviço criado com sucesso.");
    }

    // Aceitação do orçamento/proposta pelo cliente
    @PostMapping("/accept/{id}")
    public String acceptPrice(@PathVariable Long id) {
        serviceRepository.findById(id).ifPresent(service -> {
            service.setStatus(Service.ServiceStatus.AGENDAMENTO_FINALIZACAO);
            serviceRepository.save(service);
        });
        return "redirect:/service";
    }

    // Rejeição do orçamento/proposta pelo cliente
    @PostMapping("/reject/{id}")
    public String rejectPrice(@PathVariable Long id) {
        serviceRepository.findById(id).ifPresent(service -> {
            service.setStatus(Service.ServiceStatus.REJEITADO);
            serviceRepository.save(service);
        });
        return "redirect:/service";
    }

    // Reagendamento da finalização após visita
    @PostMapping("/reschedule/{id}")
    public String rescheduleCompletion(
            @PathVariable Long id,
            @RequestParam("completionDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam("completionTime") @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime time) {

        Optional<Service> optional = serviceRepository.findById(id);
        if (optional.isPresent()) {
            Service service = optional.get();

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

    // API para o frontend listar serviços do usuário autenticado
    @GetMapping("/api/service")
    @ResponseBody
    public List<Service> listarServicosDoUsuario(Authentication authentication) {
        return userService.findByUsername(authentication.getName())
                .map(serviceRepository::findByUser)
                .orElse(List.of());
    }

    // Cancelamento com motivo fornecido pelo cliente (usado via fetch ou axios)
    @PostMapping("/cancel/{id}")
    @ResponseBody
    public ResponseEntity<String> cancelarComMotivo(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Optional<Service> optional = serviceRepository.findById(id);
        if (optional.isEmpty()) return ResponseEntity.notFound().build();

        String motivo = payload.get("motivo");
        if (motivo == null || motivo.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Motivo do cancelamento é obrigatório.");
        }

        Service servico = optional.get();
        servico.setStatus(Service.ServiceStatus.CANCELADO);
        servico.setMotivoCancelamento(motivo.trim());
        serviceRepository.save(servico);

        return ResponseEntity.ok("Serviço cancelado com motivo.");
    }
}
