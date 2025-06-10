import { useEffect, useState, useContext } from "react";
import { listarTodasNotificacoes } from "../services/notificacaoService";
import { AuthContext } from "../contexts/AuthContext";

const NotificacoesPage = () => {
  const { user } = useContext(AuthContext);
  const [notificacoes, setNotificacoes] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await listarTodasNotificacoes(user.id);
        setNotificacoes(res.data);
      } catch (err) {
        console.error("Erro ao carregar notificações:", err);
      }
    };

    if (user?.id) {
      fetch();
    }
  }, [user?.id]);

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
    <div style={{ padding: "20px" }}>
      <h2>Todas as Notificações</h2>

      {notificacoes.length === 0 ? (
        <p>Você ainda não recebeu nenhuma notificação.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {notificacoes.map((n) => (
            <li
              key={n.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "10px"
              }}
            >
              <h4>{n.titulo}</h4>
              <p>{n.mensagem}</p>
              <p>
                <small>
                  Tipo: <strong>{n.tipo}</strong> | Recebido em: {formatarData(n.dataCriacao)}
                </small>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificacoesPage;
