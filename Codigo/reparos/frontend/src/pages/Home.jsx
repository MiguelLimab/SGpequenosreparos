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
      titulo: "Montagem de Móveis",
      descricao:
        "Montagem com cuidado e precisão conforme o manual do fabricante.",
    },
    {
      titulo: "Serviços Elétricos",
      descricao: "Instalações e trocas de tomadas, disjuntores e luminárias.",
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
      <nav className="nossos-servicos"><h2>Nossos Serviços</h2>
          <button>Ver todos</button></nav>
      <main className="home-content">
        <div className="servicos-type-container">
            <div className="Service-types">
              {servicos.map((servico, index) => (
                <div key={index} className="service-item">
                  <h3>{servico.titulo}</h3>
                  <p>{servico.descricao}</p>
                </div>
              ))}
            </div>
          <div className="imagem-gelson">
            <img src="./src/assets/Gelson.png" alt="Gelson" />
          </div>
        </div>

      </main>
    </div>
  );
};

export default Home;
