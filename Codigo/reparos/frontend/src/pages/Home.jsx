import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css"; // Importa o CSS que criaremos já já
import { Link } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aqui você pode limpar dados do usuário (localStorage, token, etc.)
    navigate("/");
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-title"><Link to="/home">SG Pequenos Reparos</Link></div>
        <div className="navbar-links">
        <Link to="/servico">Servicos</Link>
          <Link to="/perfil">Perfil</Link>
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
      </main>
    </div>
  );
};

export default Home;
