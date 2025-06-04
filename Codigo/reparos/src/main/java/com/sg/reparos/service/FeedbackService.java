package com.sg.reparos.service;

import com.sg.reparos.dto.FeedbackDto;
import com.sg.reparos.model.Feedback;
import com.sg.reparos.model.Service;
import com.sg.reparos.model.User;
import com.sg.reparos.repository.FeedbackRepository;
import com.sg.reparos.repository.ServiceRepository;

import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final ServiceRepository serviceRepository;

    public FeedbackService(FeedbackRepository feedbackRepository, ServiceRepository serviceRepository) {
        this.feedbackRepository = feedbackRepository;
        this.serviceRepository = serviceRepository;
    }

    /**
     * Criar um novo feedback para um serviço.
     */
    public Feedback criarFeedback(Long serviceId, Integer nota, String comentario, User usuario) {
        // Verificar se o serviço existe
        Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));

        // Verificar se o serviço pertence ao usuário
        if (!service.getUser().getId().equals(usuario.getId())) {
            throw new RuntimeException("Você não pode avaliar um serviço que não é seu");
        }

        // Verificar se o serviço está finalizado
        if (!isServicoFinalizavelParaFeedback(service.getStatus())) {
            throw new RuntimeException("Apenas serviços finalizados podem ser avaliados");
        }

        // Verificar se já existe feedback para este serviço
        if (feedbackRepository.existsByService(service)) {
            throw new RuntimeException("Este serviço já foi avaliado");
        }

        // Criar o feedback
        Feedback feedback = new Feedback();
        feedback.setService(service);
        feedback.setNota(nota);
        feedback.setComentario(comentario);

        return feedbackRepository.save(feedback);
    }

    /**
     * Buscar feedback de um serviço específico.
     */
    public Optional<Feedback> buscarFeedbackPorServico(Long serviceId) {
        return feedbackRepository.findByServiceId(serviceId);
    }

    /**
     * Buscar todos os feedbacks de um usuário.
     */
    public List<Feedback> buscarFeedbacksPorUsuario(User usuario) {
        return feedbackRepository.findByServiceUserOrderByDataAvaliacaoDesc(usuario);
    }

    /**
     * Atualizar um feedback existente.
     */
    public Feedback atualizarFeedback(Long feedbackId, Integer nota, String comentario, User usuario) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new RuntimeException("Feedback não encontrado"));

        // Verificar se o feedback pertence ao usuário
        if (!feedback.getService().getUser().getId().equals(usuario.getId())) {
            throw new RuntimeException("Você não pode editar um feedback que não é seu");
        }

        feedback.setNota(nota);
        feedback.setComentario(comentario);

        return feedbackRepository.save(feedback);
    }

    /**
     * Deletar um feedback.
     */
    public void deletarFeedback(Long feedbackId, User usuario) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new RuntimeException("Feedback não encontrado"));

        // Verificar se o feedback pertence ao usuário
        if (!feedback.getService().getUser().getId().equals(usuario.getId())) {
            throw new RuntimeException("Você não pode deletar um feedback que não é seu");
        }

        feedbackRepository.delete(feedback);
    }

    /**
     * Calcular média de avaliação de um usuário.
     */
    public Double calcularMediaAvaliacaoUsuario(User usuario) {
        return feedbackRepository.findAverageRatingByServiceUser(usuario);
    }

    /**
     * Contar total de feedbacks de um usuário.
     */
    public Long contarFeedbacksUsuario(User usuario) {
        return feedbackRepository.countFeedbacksByServiceUser(usuario);
    }

    /**
     * Verificar se um serviço pode receber feedback.
     */
    public boolean podeReceberFeedback(Long serviceId, User usuario) {
        Optional<Service> serviceOpt = serviceRepository.findById(serviceId);
        
        if (serviceOpt.isEmpty()) {
            return false;
        }

        Service service = serviceOpt.get();
        
        // Verificar se pertence ao usuário
        if (!service.getUser().getId().equals(usuario.getId())) {
            return false;
        }

        // Verificar se está finalizado
        if (!isServicoFinalizavelParaFeedback(service.getStatus())) {
            return false;
        }

        // Verificar se já tem feedback
        return !feedbackRepository.existsByService(service);
    }

    /**
     * Verificar se o status do serviço permite feedback.
     */
    private boolean isServicoFinalizavelParaFeedback(Service.ServiceStatus status) {
        return status == Service.ServiceStatus.FINALIZADO || 
               status == Service.ServiceStatus.CONCLUIDO;
    }

    /**
     * Conversão de entidade para DTO.
     */
    public FeedbackDto toDto(Feedback feedback) {
        FeedbackDto dto = new FeedbackDto();
        dto.setId(feedback.getId());
        dto.setServiceId(feedback.getService().getId());
        dto.setNota(feedback.getNota());
        dto.setComentario(feedback.getComentario());
        dto.setDataAvaliacao(feedback.getDataAvaliacao());
        return dto;
    }

    /**
     * Buscar todos os feedbacks convertidos para DTO.
     */
    public List<FeedbackDto> buscarTodosFeedbacksDto() {
        return feedbackRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}