package com.sg.reparos.service;

import com.sg.reparos.model.Notification;
import com.sg.reparos.model.User;
import com.sg.reparos.repository.NotificationRepository;
import com.sg.reparos.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    /**
     * Cria e salva uma nova notificação para um usuário específico.
     */
    public void criarNotificacaoParaUsuario(String username, String titulo, String descricao) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + username));

        Notification notification = new Notification();
        notification.setTitulo(titulo);
        notification.setDescricao(descricao);
        notification.setData(LocalDateTime.now());
        notification.setUser(user);

        notificationRepository.save(notification);
    }

    /**
     * Lista todas as notificações do usuário autenticado.
     */
public List<Notification> listarNotificacoesPorUsuario(String username) {
    return notificationRepository.findByUserUsernameOrderByDataDesc(username);
}

}
