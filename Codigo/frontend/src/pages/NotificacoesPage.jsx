import { useEffect, useState, useContext } from "react";
import { listarTodasNotificacoes } from "../services/notificacaoService";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/pages/NotificacoesPage.css";

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
    <div className="notificacoes-page">
      <h2 className="notificacoes-titulo">Todas as Notificações</h2>

      <div className="notificacoes-box">
        {notificacoes.length === 0 ? (
          <p className="notificacoes-vazio">Você ainda não recebeu nenhuma notificação.</p>
        ) : (
          <ul className="notificacoes-lista">
            {notificacoes.map((n) => (
              <li key={n.id} className="notificacao-card">
                <h4>{n.titulo}</h4>
                <p>{n.mensagem}</p>
                <p className="notificacao-info">
                  <small>
                    Tipo: <strong>{n.tipo}</strong> | Recebido em: {formatarData(n.dataCriacao)}
                  </small>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificacoesPage;
