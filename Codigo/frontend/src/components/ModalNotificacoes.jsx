import { useNavigate } from "react-router-dom";

const ModalNotificacoes = ({ notificacoes, onClose }) => {
  const navigate = useNavigate();

  const formatarData = (dataIso) => {
    const data = new Date(dataIso);
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="modal-overlay" style={overlayStyle}>
      <div className="modal-content" style={modalStyle}>
        <h3>🔔 Suas notificações</h3>
        {notificacoes.length === 0 ? (
          <p>Nenhuma notificação recente.</p>
        ) : (
          <ul>
            {notificacoes.map((n) => (
              <li key={n.id} style={{ marginBottom: "10px" }}>
                <strong>{n.titulo}</strong>
                <p>{n.mensagem}</p>
                <small>{formatarData(n.dataCriacao)}</small>
              </li>
            ))}
          </ul>
        )}

        <div style={{ marginTop: "10px" }}>
          <button
            onClick={() => navigate("/notificacoes")}
            style={{ marginRight: "10px" }}
          >
            Ver todas
          </button>
          <button onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
};

// Estilos inline (você pode substituir por CSS externo depois)
const overlayStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modalStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "400px",
  maxHeight: "80vh",
  overflowY: "auto"
};

export default ModalNotificacoes;
