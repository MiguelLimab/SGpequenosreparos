package com.sg.reparos.repository;

import com.sg.reparos.model.Service;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sg.reparos.model.Service.ServiceStatus;
import com.sg.reparos.model.Service.ServiceType;
import com.sg.reparos.model.User;

public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByStatus(ServiceStatus status);
    List<Service> findByServiceType(ServiceType type);
    List<Service> findByStatusAndServiceType(ServiceStatus status, ServiceType type);
    List<Service> findByUser(User user);
    long countByUser(User user);

    long countByUserAndStatus(User user, Service.ServiceStatus status);

List<Service> findByUserAndStatus(User user, Service.ServiceStatus status);

List<Service> findByUserAndServiceType(User user, Service.ServiceType type);

List<Service> findByUserAndStatusAndServiceType(User user, Service.ServiceStatus status, Service.ServiceType type);
boolean existsByVisitDateAndVisitTime(java.time.LocalDate visitDate, java.time.LocalTime visitTime);
}