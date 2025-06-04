package com.sg.reparos.controller;

import com.sg.reparos.dto.FeedbackDto;
import com.sg.reparos.model.Feedback;
import com.sg.reparos.model.User;
import com.sg.reparos.service.FeedbackService;
import com.sg.reparos.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Controller
@RequestMapping("/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final UserService userService;

    public FeedbackController(FeedbackService feedbackService, UserService userService) {
        this.feedbackService = feedbackService;
        this.userService = userService;
    }

    /**
     * Criar um novo feedback.
     */
    @PostMapping("/new")
    @ResponseBody
    public ResponseEntity<String> criarFeedback(
            @RequestBody Map<String, Object> payload,
            Authentication authentication) {
        
        try {
            Optional<User> userOptional = userService.findByUsername(authentication.getName());
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado.");
            }

            Long serviceId = Long.valueOf(payload.get("serviceId").toString());
            Integer nota = Integer.valueOf(payload.get("nota").toString());
            String comentario = payload.get("comentario") != null ? payload.get("comentario").toString() : "";

            feedbackService.criarFeedback(serviceId, nota, comentario, userOptional.get());
            
            return ResponseEntity.ok("Feedback criado com sucesso.");
            
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Dados inválidos fornecidos.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno do servidor.");
        }
    }

    /**
     * Buscar feedback de um serviço específico.
     */
    @GetMapping("/service/{serviceId}")
    @ResponseBody
    public ResponseEntity<FeedbackDto> buscarFeedbackPorServico(@PathVariable Long serviceId) {
        Optional<Feedback> feedback = feedbackService.buscarFeedbackPorServico(serviceId);
        
        if (feedback.isPresent()) {
            return ResponseEntity.ok(feedbackService.toDto(feedback.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Verificar se um serviço pode receber feedback.
     */
    @GetMapping("/can-review/{serviceId}")
    @ResponseBody
    public ResponseEntity<Map<String, Boolean>> podeAvaliar(
            @PathVariable Long serviceId,
            Authentication authentication) {
        
        Optional<User> userOptional = userService.findByUsername(authentication.getName());
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        boolean podeAvaliar = feedbackService.podeReceberFeedback(serviceId, userOptional.get());
        return ResponseEntity.ok(Map.of("canReview", podeAvaliar));
    }

    /**
     * Buscar todos os feedbacks do usuário.
     */
    @GetMapping("/my-feedbacks")
    @ResponseBody
    public ResponseEntity<List<FeedbackDto>> meusFeedbacks(Authentication authentication) {
        Optional<User> userOptional = userService.findByUsername(authentication.getName());
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Feedback> feedbacks = feedbackService.buscarFeedbacksPorUsuario(userOptional.get());
        List<FeedbackDto> feedbackDtos = feedbacks.stream()
                .map(feedbackService::toDto)
                .toList();

        return ResponseEntity.ok(feedbackDtos);
    }

    /**
     * Atualizar um feedback existente.
     */
    @PutMapping("/{feedbackId}")
    @ResponseBody
    public ResponseEntity<String> atualizarFeedback(
            @PathVariable Long feedbackId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication) {
        
        try {
            Optional<User> userOptional = userService.findByUsername(authentication.getName());
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado.");
            }

            Integer nota = Integer.valueOf(payload.get("nota").toString());
            String comentario = payload.get("comentario") != null ? payload.get("comentario").toString() : "";

            feedbackService.atualizarFeedback(feedbackId, nota, comentario, userOptional.get());
            
            return ResponseEntity.ok("Feedback atualizado com sucesso.");
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno do servidor.");
        }
    }

    /**
     * Deletar um feedback.
     */
    @DeleteMapping("/{feedbackId}")
    @ResponseBody
    public ResponseEntity<String> deletarFeedback(
            @PathVariable Long feedbackId,
            Authentication authentication) {
        
        try {
            Optional<User> userOptional = userService.findByUsername(authentication.getName());
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado.");
            }

            feedbackService.deletarFeedback(feedbackId, userOptional.get());
            
            return ResponseEntity.ok("Feedback deletado com sucesso.");
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno do servidor.");
        }
    }

    /**
     * Buscar estatísticas de feedback do usuário.
     */
    @GetMapping("/stats")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> estatisticasFeedback(Authentication authentication) {
        Optional<User> userOptional = userService.findByUsername(authentication.getName());
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userOptional.get();
        Double mediaAvaliacao = feedbackService.calcularMediaAvaliacaoUsuario(user);
        Long totalFeedbacks = feedbackService.contarFeedbacksUsuario(user);

        Map<String, Object> stats = Map.of(
            "mediaAvaliacao", mediaAvaliacao != null ? mediaAvaliacao : 0.0,
            "totalFeedbacks", totalFeedbacks
        );

        return ResponseEntity.ok(stats);
    }
}