import { useState } from 'react';
import Button from './Button';
import '../styles/components/ModalCancelarServico.css';

const ModalCancelarServico = ({ onConfirmar, onClose, loading }) => {
  const [motivo, setMotivo] = useState('');

  const handleConfirmar = () => {
    if (motivo.trim() === '') return;
    onConfirmar(motivo);
  };

  return (
    <div className="modal-cancelar-overlay">
      <div className="modal-cancelar-content">
        <h2 className="modal-cancelar-title">Motivo do Cancelamento</h2>
        <textarea
          className="modal-cancelar-textarea"
          placeholder="Descreva o motivo..."
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />
        <div className="modal-cancelar-actions">
          <Button onClick={handleConfirmar} variant="default" disabled={loading}>
            {loading ? 'Cancelando...' : 'Confirmar'}
          </Button>
          <Button onClick={onClose} variant="sair">Fechar</Button>
        </div>
      </div>
    </div>
  );
};

export default ModalCancelarServico;
