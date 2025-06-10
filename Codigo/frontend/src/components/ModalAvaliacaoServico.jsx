import React, { useState } from 'react';
import { enviarAvaliacao } from '../services/avaliacaoService';

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
      onAvaliado(); // recarrega os serviços
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
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Avaliar Serviço</h2>
        <form onSubmit={handleSubmit}>
          <label>Nota (1 a 5):</label>
          <input
            type="number"
            min="1"
            max="5"
            value={nota}
            onChange={(e) => setNota(Number(e.target.value))}
            required
          />

          <label>Comentário:</label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="(opcional)"
          />

          <div className="modal-actions">
            <button type="submit" disabled={enviando}>
              {enviando ? 'Enviando...' : 'Enviar Avaliação'}
            </button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAvaliacaoServico;
