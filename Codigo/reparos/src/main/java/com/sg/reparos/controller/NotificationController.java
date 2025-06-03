package com.sg.reparos.controller;

import com.sg.reparos.model.Notification;
import com.sg.reparos.model.User;
import com.sg.reparos.service.NotificationService;
import com.sg.reparos.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    public NotificationController(NotificationService notificationService, UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }

    // Buscar notificações do usuário autenticado
    @GetMapping
    public List<Notification> getUserNotifications(Authentication authentication) {
        String username = authentication.getName();
        return notificationService.listarNotificacoesPorUsuario(username);
    }

    // Criar notificação associada ao usuário autenticado
    @PostMapping("/new")
    public void createNotification(@RequestBody Notification notification, Authentication authentication) {
        String username = authentication.getName();
        notificationService.criarNotificacaoParaUsuario(username, notification.getTitulo(), notification.getDescricao());
    }
}
