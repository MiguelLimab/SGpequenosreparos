import React, { useState } from 'react';
import { enviarAvaliacao } from '../services/avaliacaoService';
import Button from './Button';
import '../styles/components/ModalAvaliacaoServico.css';

const ModalAvaliacaoServico = ({ isOpen, onClose, servico, onAvaliado }) => {
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await enviarAvaliacao({
        servicoId: servico.id,
        clienteId: servico.clienteId,
        nota,
        comentario,
      });

      alert('Avaliação enviada com sucesso!');
      onAvaliado();
      onClose();
    } catch (error) {
      console.error(error);
      alert('Erro ao enviar avaliação.');
    } finally {
      setEnviando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-avaliacao-overlay">
      <div className="modal-avaliacao-content">
        <h2 className="modal-avaliacao-title">Avaliar Serviço</h2>
        <form onSubmit={handleSubmit} className="modal-avaliacao-form">
          <label htmlFor="nota">Nota (1 a 5):</label>
          <input
            id="nota"
            type="number"
            min="1"
            max="5"
            value={nota}
            onChange={(e) => setNota(Number(e.target.value))}
            required
            className="modal-avaliacao-input"
          />

          <label htmlFor="comentario">Comentário:</label>
          <textarea
            id="comentario"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="(opcional)"
            className="modal-avaliacao-textarea"
          />

          <div className="modal-avaliacao-actions">
            <Button type="submit" variant="salvar" disabled={enviando}>
              {enviando ? 'Enviando...' : 'Enviar Avaliação'}
            </Button>
            <Button type="button" variant="cancelar" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAvaliacaoServico;
