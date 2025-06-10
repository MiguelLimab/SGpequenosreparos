package com.sg.reparos.repository;

import com.sg.reparos.model.TipoServico;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TipoServicoRepository extends JpaRepository<TipoServico, Long> {
    Optional<TipoServico> findByNome(String nome);
}
