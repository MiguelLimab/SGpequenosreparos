import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bell } from "lucide-react"; // Ícone de sino
import axios from "axios";
import "../css/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]); // Notificações dinâmicas

  const servicos = [
    {
      titulo: "Manutenção de Imóveis",
      descricao:
        "Serviços preventivos e corretivos para manter seu imóvel em ótimas condições.",
    },
    {
      titulo: "Pequenos Reparos",
      descricao: "Consertos rápidos em portas, janelas, móveis, entre outros.",
    },
    {
      titulo: "Instalação de Equipamentos",
      descricao:
        "Instalação segura de suportes, eletrodomésticos, luminárias e mais.",
    },
    {
      titulo: "Montagem de Móveis",
      descricao:
        "Montagem com cuidado e precisão conforme o manual do fabricante.",
    },
    {
      titulo: "Serviços Hidráulicos",
      descricao:
        "Reparos e instalações em torneiras, chuveiros, encanamentos e registros.",
    },
    {
      titulo: "Serviços Elétricos",
      descricao: "Instalações e trocas de tomadas, disjuntores e luminárias.",
    },
    {
      titulo: "Pintura",
      descricao:
        "Pintura profissional para interiores e exteriores com ótimo acabamento.",
    },
  ];

  useEffect(() => {
    buscarNotificacoes();
  }, []);

  const buscarNotificacoes = async () => {
    try {
      const response = await axios.get("http://localhost:8081/notifications", {
        withCredentials: true,
      });
      setNotifications(response.data);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-title">
          <Link to="/home">SG Pequenos Reparos</Link>
        </div>
        <div className="navbar-links">
          <Link to="/service">Serviços</Link>
          <Link to="/perfil">Perfil</Link>

          {/* Botão de Notificações */}
          <div
            className="notification-wrapper"
            style={{ position: "relative" }}
          >
            <button
              onClick={toggleNotifications}
              className="notification-button"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                marginLeft: "15px",
              }}
            >
              <Bell size={24} />
            </button>
            {showNotifications && (
              <div
                className="notification-box"
                style={{
                  position: "absolute",
                  top: "40px",
                  right: "0",
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  width: "300px",
                  maxHeight: "400px",
                  overflowY: "auto",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                  zIndex: 1000,
                }}
              >
                <ul style={{ listStyle: "none", padding: "10px", margin: 0 }}>
                  {notifications.length === 0 ? (
                    <li style={{ padding: "10px", color: "#2a4a7c" }}>Nenhuma notificação.</li>
                  ) : (
                    notifications.map((notification) => (
                      <li
                        key={notification.id}
                        style={{
                          padding: "8px 0",
                          borderBottom: "1px solid #eee",
                          color: "#2a4a7c", // <- AQUI
                        }}
                      >
                        <strong style={{ color: "#2a4a7c" }}>
                          {notification.titulo}
                        </strong>
                        <br />
                        <small style={{ color: "#2a4a7c" }}>
                          {notification.descricao}
                        </small>
                        <br />
                        <small style={{ color: "#888" }}>
                          {new Date(notification.data).toLocaleString("pt-BR")}
                        </small>
                      </li>
                    ))
                  )}
                </ul>
                <div
                  style={{
                    padding: "10px",
                    borderTop: "1px solid #eee",
                    textAlign: "center",
                  }}
                >
                  <Link
                    to="/notifications"
                    style={{
                      textDecoration: "none",
                      color: "#2a4a7c",
                      fontWeight: "bold",
                    }}
                  >
                    Mais detalhes
                  </Link>
                </div>
              </div>
            )}
          </div>

          <button onClick={handleLogout}>Sair</button>
        </div>
      </nav>

      <main className="home-content">
        <div className="home-card">
          <h2>Bem-vindo ao SG Pequenos Reparos!</h2>
          <p>
            Nosso sistema foi desenvolvido para conectar você com profissionais
            de manutenção de forma simples, rápida e organizada.
          </p>
          <p>
            Aqui você pode solicitar serviços, acompanhar atendimentos,
            atualizar seu perfil e muito mais!
          </p>
        </div>

        <div className="servicos-section">
          <h2 className="servicos-titulo">Nossos Serviços</h2>
          <div className="servicos-grid">
            {servicos.map((servico, index) => (
              <div key={index} className="servico-card">
                <h3>{servico.titulo}</h3>
                <p>{servico.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
