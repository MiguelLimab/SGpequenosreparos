package com.sg.reparos.service;

import com.sg.reparos.model.Notification;
import com.sg.reparos.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    /**
     * Cria e salva uma nova notificação.
     */
    public void criarNotificacao(String titulo, String descricao) {
        Notification notification = new Notification(
                titulo,
                descricao,
                LocalDateTime.now()
        );
        notificationRepository.save(notification);
    }

    /**
     * Lista todas as notificações.
     */
    public List<Notification> listarNotificacoes() {
        return notificationRepository.findAll();
    }
}
