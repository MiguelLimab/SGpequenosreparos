package com.sg.reparos.repository;

import com.sg.reparos.model.Itinerario;
import com.sg.reparos.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ItinerarioRepository extends JpaRepository<Itinerario, Long> {
    Optional<Itinerario> findByProfissional(Usuario profissional);
}
