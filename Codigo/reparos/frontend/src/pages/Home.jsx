import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/Home.css";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const servicos = [
    {
      titulo: "Pequenos Reparos",
      descricao: "Consertos rápidos em portas, janelas, móveis, entre outros.",
    },
    {
      titulo: "Instalação de Equipamentos",
      descricao: "Instalação segura de suportes, eletrodomésticos, luminárias e mais.",
    },
    {
      titulo: "Montagem de Móveis",
      descricao: "Montagem com cuidado e precisão conforme o manual do fabricante.",
    },
    {
      titulo: "Serviços Elétricos",
      descricao: "Instalações e trocas de tomadas, disjuntores e luminárias.",
    },
  ];

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-title"><Link to="/home">SG Pequenos Reparos</Link></div>
        <div className="navbar-links">
          <Link to="/service">Serviços</Link>
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
        <div className="nossos-servicos"><h2 className="titulo-principal">Nossos Serviços</h2>
        <button>Ver todos</button></div>
        <div className="servicos-carrossel-container">
          <div className="imagem-gelson">
            <img src="./src/assets/gelson.jpeg" alt="Gelson" />
          </div>
          <div className="carrossel-servicos">
            <div className="carrossel-lista">
              {servicos.map((servico, index) => (
                <div key={index} className="carrossel-item">
                  <h3>{servico.titulo}</h3>
                  <p>{servico.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Home;