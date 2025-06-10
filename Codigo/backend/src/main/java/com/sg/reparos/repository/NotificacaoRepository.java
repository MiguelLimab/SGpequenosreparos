package com.sg.reparos.repository;

import com.sg.reparos.model.Notificacao;
import com.sg.reparos.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {
    List<Notificacao> findByClienteOrAdminOrderByDataCriacaoDesc(Usuario cliente, Usuario admin);

    List<Notificacao> findTop3ByClienteOrAdminOrderByDataCriacaoDesc(Usuario cliente, Usuario admin);

    boolean existsByTipoAndClienteAndTitulo(Notificacao.TipoNotificacao tipo, Usuario cliente, String titulo);

    boolean existsByTipoAndAdminAndTitulo(Notificacao.TipoNotificacao tipo, Usuario admin, String titulo);

}
