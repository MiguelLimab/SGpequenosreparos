import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import "../css/Notificacoes.css";

const Notificacoes = () => {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  useEffect(() => {
    // Simulando busca de notificações
    const fetchNotificacoes = async () => {
      try {
        // Aqui você pode substituir por um GET real futuramente
        const notificacoesFalsas = [
          {
            id: 1,
            titulo: "Novo serviço disponível",
            descricao: "Há um novo serviço de pintura disponível para agendamento.",
            data: "2025-06-01",
          },
          {
            id: 2,
            titulo: "Serviço finalizado",
            descricao: "Seu serviço de instalação elétrica foi finalizado com sucesso.",
            data: "2025-05-28",
          },
          {
            id: 3,
            titulo: "Mensagem do suporte",
            descricao: "Sua solicitação de alteração de endereço foi atendida.",
            data: "2025-05-25",
          },
        ];

        setTimeout(() => {
          setNotificacoes(notificacoesFalsas);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
        setLoading(false);
      }
    };

    fetchNotificacoes();
  }, []);

  return (
    <div className="notificacoes-container">
      <nav className="navbar">
        <div className="navbar-title">
          <Link to="/home">SG Pequenos Reparos</Link>
        </div>
        <div className="navbar-links">
          <Link to="/service">Serviços</Link>
          <Link to="/servicehistory">Histórico</Link>
          <Link to="/perfil">Perfil</Link>
          <button onClick={handleLogout}>Sair</button>
        </div>
      </nav>

      <div className="notificacoes-content">
        <h1><Bell size={28} /> Minhas Notificações</h1>

        {loading ? (
          <p>Carregando notificações...</p>
        ) : notificacoes.length === 0 ? (
          <p>Você não possui notificações no momento.</p>
        ) : (
          <ul className="notificacoes-list">
            {notificacoes.map((notificacao) => (
              <li key={notificacao.id} className="notificacao-item">
                <h3>{notificacao.titulo}</h3>
                <p>{notificacao.descricao}</p>
                <span className="data">{new Date(notificacao.data).toLocaleDateString("pt-BR")}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notificacoes;
