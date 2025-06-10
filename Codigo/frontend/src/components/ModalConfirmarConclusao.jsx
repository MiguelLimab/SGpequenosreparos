import Button from './Button';
import '../styles/components/ModalConfirmarConclusao.css';

const ModalConfirmarConclusao = ({ onConfirmar, onClose, loading }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Confirmar Conclusão</h2>
        <p className="modal-texto">
          Tem certeza que deseja marcar este serviço como <strong>concluído</strong>?
        </p>
        <div className="modal-actions">
          <Button
            onClick={onConfirmar}
            variant="concluir"
            disabled={loading}
          >
            {loading ? 'Concluindo...' : 'Confirmar'}
          </Button>
          <Button onClick={onClose} variant="sair">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmarConclusao;
