package com.sg.reparos.repository;

import com.sg.reparos.model.Notification;
import com.sg.reparos.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Novo método para buscar notificações de um usuário específico
    List<Notification> findByUserOrderByDataDesc(User user);
    List<Notification> findByUser(User user);
    List<Notification> findByUserUsernameOrderByDataDesc(String username);

}
