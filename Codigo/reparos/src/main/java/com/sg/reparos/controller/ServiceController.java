package com.sg.reparos.controller;

import com.sg.reparos.dto.ServiceDto;
import com.sg.reparos.model.Service;
import com.sg.reparos.model.User;
import com.sg.reparos.repository.ServiceRepository;
import com.sg.reparos.service.NotificationService;
import com.sg.reparos.service.ServiceService;
import com.sg.reparos.service.UserService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Sort;


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
    private final ServiceService serviceService;
    private final NotificationService notificationService;

    public ServiceController(ServiceRepository serviceRepository, UserService userService,
            ServiceService serviceService, NotificationService notificationService) {
        this.serviceRepository = serviceRepository;
        this.userService = userService;
        this.serviceService = serviceService;
        this.notificationService = notificationService;
    }

    @GetMapping
    public String servicePage(@RequestParam(required = false) Service.ServiceStatus status, Model model,
            Authentication authentication) {
        Optional<User> userOptional = userService.findByUsername(authentication.getName());
        if (userOptional.isEmpty())
            return "redirect:/login";

        User user = userOptional.get();
        List<Service> services = (status != null)
                ? serviceRepository.findByUserAndStatus(user, status)
                : serviceRepository.findByUser(user);

        model.addAttribute("services", services);
        return "service";
    }

    @PostMapping("/new")
    public ResponseEntity<String> createService(@ModelAttribute ServiceDto serviceDto, Authentication authentication) {
        Optional<User> userOptional = userService.findByUsername(authentication.getName());
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado.");
        }

        LocalDate visitDate = serviceDto.getVisitDate();
        LocalTime visitTime = serviceDto.getVisitTime();

        if (visitDate.isBefore(LocalDate.now()) ||
                (visitDate.isEqual(LocalDate.now()) && visitTime.isBefore(LocalTime.now()))) {
            return ResponseEntity.badRequest().body("A data e hora da visita não podem estar no passado.");
        }

        try {
            serviceService.validarDataPermitida(visitDate);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

        if (serviceRepository.existsByVisitDateAndVisitTime(visitDate, visitTime)) {
            return ResponseEntity.badRequest().body("Já existe um serviço agendado nesse horário.");
        }

        Service service = new Service();
        service.setServiceType(Service.ServiceType.valueOf(serviceDto.getServiceType()));
        service.setLocation(serviceDto.getLocation());
        service.setDescription(serviceDto.getDescription());
        service.setVisitDate(visitDate);
        service.setVisitTime(visitTime);
        service.setStatus(Service.ServiceStatus.AGENDAMENTO_VISITA);
        service.setUser(userOptional.get());

        serviceRepository.save(service);

        // ✅ Criar notificação para o usuário
        notificationService.criarNotificacaoParaUsuario(
                userOptional.get().getUsername(),
                "Novo serviço agendado",
                "Você agendou um serviço de " + service.getServiceType() + " para " + service.getVisitDate());

        return ResponseEntity.ok("Serviço criado com sucesso.");
    }

    @PostMapping("/accept/{id}")
    public String acceptPrice(@PathVariable Long id, Authentication authentication) {
        return alterarStatusDoUsuario(id, authentication, Service.ServiceStatus.AGENDAMENTO_FINALIZACAO);
    }

    @PostMapping("/reject/{id}")
    public String rejectPrice(@PathVariable Long id, Authentication authentication) {
        return alterarStatusDoUsuario(id, authentication, Service.ServiceStatus.REJEITADO);
    }

    private String alterarStatusDoUsuario(Long id, Authentication authentication, Service.ServiceStatus novoStatus) {
        Optional<Service> optional = serviceRepository.findById(id);
        if (optional.isPresent() && pertenceAoUsuarioOuAdmin(optional.get(), authentication)) {
            Service service = optional.get();
            service.setStatus(novoStatus);
            serviceRepository.save(service);
        }
        return "redirect:/service";
    }

    @PostMapping("/reschedule/{id}")
    public String rescheduleCompletion(
            @PathVariable Long id,
            @RequestParam("completionDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam("completionTime") @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime time,
            Authentication authentication) {

        Optional<Service> optional = serviceRepository.findById(id);
        if (optional.isPresent() && pertenceAoUsuarioOuAdmin(optional.get(), authentication)) {
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

@GetMapping("/api/service")
@ResponseBody
public List<Service> listarServicos(Authentication authentication) {
    boolean isAdmin = authentication.getAuthorities().stream()
            .anyMatch(role -> role.getAuthority().equals("ROLE_ADMIN"));

    Sort sortByDateDesc = Sort.by(Sort.Direction.DESC, "visitDate", "visitTime");

    if (isAdmin) {
        return serviceRepository.findAll(sortByDateDesc); // Aqui
    } else {
        return userService.findByUsername(authentication.getName())
                .map(user -> serviceRepository.findByUser(user, sortByDateDesc)) // E aqui
                .orElse(List.of());
    }
}


    @PostMapping("/cancel/{id}")
    @ResponseBody
    public ResponseEntity<String> cancelarComMotivo(@PathVariable Long id, @RequestBody Map<String, String> payload,
            Authentication authentication) {
        Optional<Service> optional = serviceRepository.findById(id);
        if (optional.isEmpty())
            return ResponseEntity.notFound().build();

        Service servico = optional.get();
        if (!pertenceAoUsuarioOuAdmin(servico, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você não pode cancelar este serviço.");
        }

        String motivo = payload.get("motivo");
        if (motivo == null || motivo.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Motivo do cancelamento é obrigatório.");
        }

        servico.setStatus(Service.ServiceStatus.CANCELADO);
        servico.setMotivoCancelamento(motivo.trim());
        serviceRepository.save(servico);

        // ✅ Notificar cancelamento
        notificationService.criarNotificacaoParaUsuario(
                servico.getUser().getUsername(),
                "Serviço cancelado",
                "Seu serviço de " + servico.getServiceType() + " foi cancelado. Motivo: " + motivo.trim());

        return ResponseEntity.ok("Serviço cancelado com motivo.");
    }

private boolean pertenceAoUsuarioOuAdmin(Service service, Authentication authentication) {
    String username = authentication.getName();
    boolean isAdmin = authentication.getAuthorities().stream()
            .anyMatch(role -> role.getAuthority().equals("ROLE_ADMIN"));

    return service.getUser().getUsername().equals(username) || isAdmin;
}

}
