package com.sg.reparos.controller;

import com.sg.reparos.model.Notification;
import com.sg.reparos.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<Notification> getAllNotifications() {
        return notificationService.listarNotificacoes();
    }

    @PostMapping("/new")
    public void createNotification(@RequestBody Notification notification) {
        notificationService.criarNotificacao(notification.getTitulo(), notification.getDescricao());
    }
}
