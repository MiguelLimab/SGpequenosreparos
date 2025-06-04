package com.sg.reparos.repository;

import com.sg.reparos.model.Feedback;
import com.sg.reparos.model.Service;
import com.sg.reparos.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    
    Optional<Feedback> findByService(Service service);
    
    Optional<Feedback> findByServiceId(Long serviceId);
    
    boolean existsByService(Service service);
    
    boolean existsByServiceId(Long serviceId);
    
    List<Feedback> findByServiceUser(User user);
    
    @Query("SELECT f FROM Feedback f WHERE f.service.user = :user ORDER BY f.dataAvaliacao DESC")
    List<Feedback> findByServiceUserOrderByDataAvaliacaoDesc(@Param("user") User user);
    
    @Query("SELECT AVG(f.nota) FROM Feedback f WHERE f.service.user = :user")
    Double findAverageRatingByServiceUser(@Param("user") User user);
    
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.service.user = :user")
    Long countFeedbacksByServiceUser(@Param("user") User user);
    
    @Query("SELECT f FROM Feedback f WHERE f.nota = :nota")
    List<Feedback> findByNota(@Param("nota") Integer nota);
    
    void deleteByService(Service service);
}
