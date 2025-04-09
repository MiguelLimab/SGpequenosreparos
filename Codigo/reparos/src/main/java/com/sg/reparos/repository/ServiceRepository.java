package com.sg.reparos.repository;

import com.sg.reparos.model.Service;
import com.sg.reparos.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByUser(User user);
    List<Service> findByStatus(Service.ServiceStatus status);
    List<Service> findByUserAndStatus(User user, Service.ServiceStatus status);
}