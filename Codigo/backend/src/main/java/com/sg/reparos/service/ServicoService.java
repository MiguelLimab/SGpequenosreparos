package com.sg.reparos.service;

import com.sg.reparos.dto.NotificacaoRequestDTO;
import com.sg.reparos.dto.ServicoRequestDTO;
import com.sg.reparos.dto.ServicoResponseDTO;
import com.sg.reparos.model.Notificacao;
import com.sg.reparos.model.Servico;
import com.sg.reparos.model.Servico.DiaSemana;
import com.sg.reparos.model.Servico.Periodo;
import com.sg.reparos.model.Servico.StatusServico;
import com.sg.reparos.model.TipoServico;
import com.sg.reparos.model.Usuario;
import com.sg.reparos.repository.ServicoRepository;
import com.sg.reparos.repository.TipoServicoRepository;
import com.sg.reparos.repository.UsuarioRepository;
import com.sg.reparos.repository.NotificacaoRepository;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServicoService {

    private final ServicoRepository servicoRepository;
    private final UsuarioRepository usuarioRepository;
    private final TipoServicoRepository tipoServicoRepository;
    private final NotificacaoService notificacaoService;
    private final NotificacaoRepository notificacaoRepository;

    public ServicoService(ServicoRepository servicoRepository,
            UsuarioRepository usuarioRepository,
            TipoServicoRepository tipoServicoRepository,
            NotificacaoService notificacaoService,
            NotificacaoRepository notificacaoRepository) {
        this.servicoRepository = servicoRepository;
        this.usuarioRepository = usuarioRepository;
        this.tipoServicoRepository = tipoServicoRepository;
        this.notificacaoService = notificacaoService;
        this.notificacaoRepository = notificacaoRepository;
    }

    public ServicoResponseDTO solicitarServico(ServicoRequestDTO dto) {
        Servico servico = new Servico();
        servico.setNome(dto.getNome());
        servico.setDescricao(dto.getDescricao());
        servico.setEmailContato(dto.getEmailContato());
        servico.setTelefoneContato(dto.getTelefoneContato());
        servico.setStatus(StatusServico.SOLICITADO);

        Usuario cliente = usuarioRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        TipoServico tipoServico = tipoServicoRepository.findById(dto.getTipoServicoId())
                .orElseThrow(() -> new RuntimeException("Tipo de serviço não encontrado"));

        servico.setCliente(cliente);
        servico.setTipoServico(tipoServico);

        List<DiaSemana> diasDisponiveis = dto.getDiasDisponiveisCliente().stream()
                .map(dia -> DiaSemana.valueOf(dia.toUpperCase()))
                .collect(Collectors.toList());
        servico.setDiasDisponiveisCliente(diasDisponiveis);

        servico.setPeriodoDisponivelCliente(Periodo.valueOf(dto.getPeriodoDisponivelCliente().toUpperCase()));

        Servico salvo = servicoRepository.save(servico);

        NotificacaoRequestDTO notiCliente = new NotificacaoRequestDTO();
        notiCliente.setTitulo("Solicitação enviada com sucesso");
        notiCliente.setMensagem("Você solicitou o serviço: " + salvo.getNome());
        notiCliente.setClienteId(salvo.getCliente().getId());
        notiCliente.setTipo(Notificacao.TipoNotificacao.SOLICITACAO);
        notificacaoService.enviar(notiCliente);

        if (salvo.getAdministrador() != null) {
            NotificacaoRequestDTO notiAdmin = new NotificacaoRequestDTO();
            notiAdmin.setTitulo("Novo serviço solicitado");
            notiAdmin.setMensagem(
                    "O cliente " + salvo.getCliente().getNome() + " solicitou o serviço: " + salvo.getNome());
            notiAdmin.setAdminId(salvo.getAdministrador().getId());
            notiAdmin.setTipo(Notificacao.TipoNotificacao.SOLICITACAO);
            notificacaoService.enviar(notiAdmin);
        }

        return toResponseDTO(salvo);
    }

    public ServicoResponseDTO aceitarServico(Long id, Long administradorId, String data, String horario) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));

        Usuario administrador = usuarioRepository.findById(administradorId)
                .orElseThrow(() -> new RuntimeException("Administrador não encontrado"));

        LocalDate dataAgendada = LocalDate.parse(data);
        LocalTime horarioAgendado = LocalTime.parse(horario);

        DiaSemana diaSemanaAgendado = converterDiaSemana(dataAgendada.getDayOfWeek().name());
        if (!servico.getDiasDisponiveisCliente().contains(diaSemanaAgendado)) {
            throw new RuntimeException("O dia selecionado não está disponível para o cliente.");
        }

        if (!validarHorarioDentroPeriodo(servico.getPeriodoDisponivelCliente(), horarioAgendado)) {
            throw new RuntimeException("O horário selecionado não está dentro do período disponível do cliente.");
        }

        servico.setStatus(StatusServico.ACEITO);
        servico.setAdministrador(administrador);
        servico.setData(dataAgendada);
        servico.setHorario(horarioAgendado);

        Servico atualizado = servicoRepository.save(servico);

        notificacaoService.enviar(new NotificacaoRequestDTO("Serviço aceito e agendado",
                "Seu serviço '" + atualizado.getNome() + "' foi aceito e agendado para " + atualizado.getData() + " às "
                        + atualizado.getHorario(),
                atualizado.getCliente().getId(), null, Notificacao.TipoNotificacao.AGENDAMENTO));

        notificacaoService.enviar(new NotificacaoRequestDTO("Serviço agendado com sucesso",
                "Você agendou o serviço '" + atualizado.getNome() + "' para " + atualizado.getData() + " às "
                        + atualizado.getHorario(),
                null, administrador.getId(), Notificacao.TipoNotificacao.AGENDAMENTO));

        return toResponseDTO(atualizado);
    }

    public ServicoResponseDTO recusarServico(Long id) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        servico.setStatus(StatusServico.RECUSADO);
        Servico atualizado = servicoRepository.save(servico);

        notificacaoService.enviar(new NotificacaoRequestDTO("Serviço recusado",
                "Seu serviço '" + atualizado.getNome() + "' foi recusado.",
                atualizado.getCliente().getId(), null, Notificacao.TipoNotificacao.RECUSA));

        return toResponseDTO(atualizado);
    }

    public ServicoResponseDTO cancelarServico(Long id, String motivo) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        servico.setStatus(StatusServico.CANCELADO);
        servico.setMotivoCancelamento(motivo);
        Servico atualizado = servicoRepository.save(servico);

        notificacaoService.enviar(new NotificacaoRequestDTO("Serviço cancelado",
                "O serviço '" + atualizado.getNome() + "' foi cancelado. Motivo: " + motivo,
                atualizado.getCliente().getId(),
                atualizado.getAdministrador() != null ? atualizado.getAdministrador().getId() : null,
                Notificacao.TipoNotificacao.CANCELAMENTO));

        return toResponseDTO(atualizado);
    }

    public ServicoResponseDTO concluirServico(Long id) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        servico.setStatus(StatusServico.CONCLUIDO);
        Servico atualizado = servicoRepository.save(servico);

        notificacaoService.enviar(new NotificacaoRequestDTO("Serviço concluído",
                "O serviço '" + atualizado.getNome() + "' foi concluído.",
                atualizado.getCliente().getId(),
                atualizado.getAdministrador() != null ? atualizado.getAdministrador().getId() : null,
                Notificacao.TipoNotificacao.CONCLUSAO));

        return toResponseDTO(atualizado);
    }

    public ServicoResponseDTO editarServico(Long id, ServicoRequestDTO dto) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));

        servico.setNome(dto.getNome());
        servico.setDescricao(dto.getDescricao());

        TipoServico tipo = tipoServicoRepository.findById(dto.getTipoServicoId())
                .orElseThrow(() -> new RuntimeException("Tipo de serviço não encontrado"));
        servico.setTipoServico(tipo);

        Usuario cliente = usuarioRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        servico.setCliente(cliente);

        List<DiaSemana> dias = dto.getDiasDisponiveisCliente().stream()
                .map(String::toUpperCase)
                .map(DiaSemana::valueOf)
                .collect(Collectors.toList());
        servico.setDiasDisponiveisCliente(dias);

        servico.setPeriodoDisponivelCliente(Periodo.valueOf(dto.getPeriodoDisponivelCliente().toUpperCase()));

        if (dto.getData() != null)
            servico.setData(dto.getData());
        if (dto.getHorario() != null)
            servico.setHorario(dto.getHorario());
        if (dto.getStatus() != null)
            servico.setStatus(StatusServico.valueOf(dto.getStatus().toUpperCase()));

        Servico atualizado = servicoRepository.save(servico);

        notificacaoService.enviar(new NotificacaoRequestDTO("Serviço editado",
                "O serviço '" + atualizado.getNome() + "' foi editado pelo administrador.",
                atualizado.getCliente().getId(),
                atualizado.getAdministrador() != null ? atualizado.getAdministrador().getId() : null,
                Notificacao.TipoNotificacao.EDICAO));

        return toResponseDTO(atualizado);
    }

    @Scheduled(fixedRate = 60000) // a cada 1 minuto (60.000 ms)
    public void notificarServicosAgendadosProximos() {
        System.out.println("[SCHEDULER] Rodando lembretes às: " + LocalDateTime.now());

        LocalDateTime agora = LocalDateTime.now();
        LocalDateTime limite = agora.plusHours(24);

        List<Servico> agendados = servicoRepository.findByStatus(Servico.StatusServico.ACEITO).stream()
                .filter(s -> s.getData() != null && s.getHorario() != null)
                .filter(s -> {
                    LocalDateTime agendamento = LocalDateTime.of(s.getData(), s.getHorario());
                    return agendamento.isAfter(agora) && !agendamento.isAfter(limite);
                })
                .toList();

        for (Servico s : agendados) {
            String msg = "O serviço \"" + s.getNome() + "\" está agendado para "
                    + s.getData() + " às " + s.getHorario();

            boolean lembreteClienteJaEnviado = notificacaoRepository
                    .existsByTipoAndClienteAndTitulo(Notificacao.TipoNotificacao.LEMBRETE, s.getCliente(),
                            "Lembrete: serviço em breve");

            if (!lembreteClienteJaEnviado) {
                notificacaoService.enviar(new NotificacaoRequestDTO(
                        "Lembrete: serviço em breve",
                        msg,
                        s.getCliente().getId(),
                        null,
                        Notificacao.TipoNotificacao.LEMBRETE));
            }

            if (s.getAdministrador() != null) {
                boolean lembreteAdminJaEnviado = notificacaoRepository
                        .existsByTipoAndAdminAndTitulo(Notificacao.TipoNotificacao.LEMBRETE, s.getAdministrador(),
                                "Lembrete: serviço em breve");

                if (!lembreteAdminJaEnviado) {
                    notificacaoService.enviar(new NotificacaoRequestDTO(
                            "Lembrete: serviço em breve",
                            msg,
                            null,
                            s.getAdministrador().getId(),
                            Notificacao.TipoNotificacao.LEMBRETE));
                }
            }
        }
    }

    public List<ServicoResponseDTO> listarTodos() {
        return servicoRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public ServicoResponseDTO buscarPorId(Long id) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        return toResponseDTO(servico);
    }

    private ServicoResponseDTO toResponseDTO(Servico servico) {
        ServicoResponseDTO dto = new ServicoResponseDTO();
        dto.setId(servico.getId());
        dto.setNome(servico.getNome());
        dto.setDescricao(servico.getDescricao());
        dto.setTipoServico(servico.getTipoServico().getNome());
        dto.setClienteId(servico.getCliente().getId());
        dto.setClienteNome(servico.getCliente().getNome());
        dto.setEmailContato(servico.getEmailContato());
        dto.setTelefoneContato(servico.getTelefoneContato());

        List<String> dias = servico.getDiasDisponiveisCliente().stream()
                .map(Enum::name)
                .collect(Collectors.toList());
        dto.setDiasDisponiveisCliente(dias);

        dto.setPeriodoDisponivelCliente(servico.getPeriodoDisponivelCliente().name());
        dto.setStatus(servico.getStatus().name());

        if (servico.getAdministrador() != null) {
            dto.setAdministradorNome(servico.getAdministrador().getNome());
        }
        dto.setData(servico.getData());
        dto.setHorario(servico.getHorario());
        return dto;
    }

    private DiaSemana converterDiaSemana(String dayOfWeek) {
        return switch (dayOfWeek) {
            case "MONDAY" -> DiaSemana.SEGUNDA;
            case "TUESDAY" -> DiaSemana.TERCA;
            case "WEDNESDAY" -> DiaSemana.QUARTA;
            case "THURSDAY" -> DiaSemana.QUINTA;
            case "FRIDAY" -> DiaSemana.SEXTA;
            case "SATURDAY" -> DiaSemana.SABADO;
            case "SUNDAY" -> DiaSemana.DOMINGO;
            default -> throw new IllegalArgumentException("Dia da semana inválido.");
        };
    }

    private boolean validarHorarioDentroPeriodo(Periodo periodoCliente, LocalTime horario) {
        return switch (periodoCliente) {
            case MANHA -> horario.isAfter(LocalTime.of(5, 59)) && horario.isBefore(LocalTime.of(12, 0));
            case TARDE -> horario.isAfter(LocalTime.of(11, 59)) && horario.isBefore(LocalTime.of(18, 0));
            case NOITE -> horario.isAfter(LocalTime.of(17, 59)) && horario.isBefore(LocalTime.of(23, 59));
        };
    }
}
