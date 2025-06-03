import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import axios from "axios"; 
import "../css/Notificacoes.css";

const Notificacoes = () => {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchNotificacoes = async () => {
      try {
        const response = await axios.get("http://localhost:8081/notifications", {
          withCredentials: true,
        });
        setNotificacoes(response.data);
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
        setErro("Erro ao carregar notificações.");
      } finally {
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
        <h1 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Bell size={28} /> Minhas Notificações
        </h1>

        {loading ? (
          <p>Carregando notificações...</p>
        ) : erro ? (
          <p>{erro}</p>
        ) : notificacoes.length === 0 ? (
          <p>Você não possui notificações no momento.</p>
        ) : (
          <ul className="notificacoes-list">
            {notificacoes.map((notificacao) => (
              <li key={notificacao.id} className="notificacao-item">
                <h3>{notificacao.titulo}</h3>
                <p>{notificacao.descricao}</p>
                <span className="data">
                  {new Date(notificacao.data).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notificacoes;
