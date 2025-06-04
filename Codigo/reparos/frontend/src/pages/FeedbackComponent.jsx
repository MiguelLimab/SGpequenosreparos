import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FeedbackComponent = ({ serviceId, existingFeedback, onFeedbackSubmitted }) => {
  const [canReview, setCanReview] = useState(false);
  const [feedback, setFeedback] = useState(existingFeedback || null);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkCanReview();
    if (!existingFeedback) {
      fetchExistingFeedback();
    }
  }, [serviceId]);

  const checkCanReview = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/feedback/can-review/${serviceId}`, {
        withCredentials: true
      });
      setCanReview(response.data.canReview);
    } catch (err) {
      console.error('Erro ao verificar se pode avaliar:', err);
    }
  };

  const fetchExistingFeedback = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/feedback/service/${serviceId}`, {
        withCredentials: true
      });
      setFeedback(response.data);
    } catch (err) {
      // Se não encontrar feedback, é normal - o serviço ainda não foi avaliado
      if (err.response?.status !== 404) {
        console.error('Erro ao buscar feedback:', err);
      }
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Por favor, selecione uma nota de 1 a 5 estrelas.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        serviceId: serviceId,
        nota: rating,
        comentario: comment
      };

      await axios.post('http://localhost:8081/feedback/new', payload, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });

      // Atualizar o feedback local
      const newFeedback = {
        nota: rating,
        comentario: comment,
        dataAvaliacao: new Date().toISOString()
      };
      
      setFeedback(newFeedback);
      setShowForm(false);
      setCanReview(false);
      
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted(newFeedback);
      }

      alert('Avaliação enviada com sucesso!');
      
    } catch (err) {
      console.error('Erro ao enviar feedback:', err);
      setError(err.response?.data || 'Erro ao enviar avaliação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (isInteractive = false) => {
    const stars = [];
    const currentRating = isInteractive ? (hoveredStar || rating) : (feedback?.nota || 0);
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= currentRating ? 'filled' : 'empty'} ${isInteractive ? 'interactive' : ''}`}
          onClick={isInteractive ? () => setRating(i) : undefined}
          onMouseEnter={isInteractive ? () => setHoveredStar(i) : undefined}
          onMouseLeave={isInteractive ? () => setHoveredStar(0) : undefined}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Se já existe feedback, mostra a avaliação
  if (feedback) {
    return (
      <div className="feedback-display">
        <h4>✅ Sua Avaliação:</h4>
        <div className="rating-display">
          {renderStars(false)}
          <span className="rating-text">({feedback.nota}/5)</span>
        </div>
        {feedback.comentario && (
          <div className="comment-display">
            <p><strong>Comentário:</strong> {feedback.comentario}</p>
          </div>
        )}
        {feedback.dataAvaliacao && (
          <p className="feedback-date">Avaliado em: {formatDate(feedback.dataAvaliacao)}</p>
        )}
      </div>
    );
  }

  // Se pode avaliar, mostra o botão ou formulário
  if (canReview) {
    return (
      <div className="feedback-section">
        {!showForm ? (
          <button 
            className="avaliar-btn"
            onClick={() => setShowForm(true)}
          >
            ⭐ Avaliar Serviço
          </button>
        ) : (
          <form className="feedback-form" onSubmit={handleSubmitFeedback}>
            <h4>📝 Avaliar este serviço:</h4>
            
            <div className="rating-input">
              <label>Nota (1 a 5 estrelas):</label>
              <div className="stars-container">
                {renderStars(true)}
              </div>
              {rating > 0 && (
                <p style={{fontSize: '14px', color: '#666', marginTop: '5px'}}>
                  Você selecionou {rating} estrela{rating > 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div className="comment-input">
              <label htmlFor="comment">Comentário (opcional):</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Compartilhe sua experiência com este serviço..."
                rows="3"
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="form-buttons">
              <button 
                type="submit" 
                disabled={loading}
                className="submit-btn"
              >
                {loading ? 'Enviando...' : 'Enviar Avaliação'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowForm(false);
                  setRating(0);
                  setComment('');
                  setError('');
                  setHoveredStar(0);
                }}
                className="cancel-btn"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  return null;
};

export default FeedbackComponent;