import Button from './Button';
import '../styles/components/ModalConfirmarRecusa.css';

const ModalConfirmarRecusa = ({ onConfirmar, onClose, loading }) => {
  return (
    <div className="modal-confirmar-overlay">
      <div className="modal-confirmar-content">
        <h2 className="modal-confirmar-title">Confirmar Recusa</h2>
        <p>Tem certeza que deseja recusar este serviço?</p>

        <div className="modal-confirmar-actions">
          <Button onClick={onConfirmar} disabled={loading}>
            {loading ? 'Recusando...' : 'Confirmar'}
          </Button>
          <Button variant="sair" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmarRecusa;
