// Atualizado com cards no banner e melhorias visuais
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { listarTipos } from "../services/tipoService";
import { listarAvaliacoes } from "../services/avaliacaoService";
import Button from "../components/Button";

import "../styles/pages/LandingPage.css";

const LandingPage = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [servicosExibidos, setServicos] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const resServicos = await listarTipos();
        setServicos(resServicos.data);

        const resAvaliacoes = await listarAvaliacoes();
        setAvaliacoes(resAvaliacoes.data);
      } catch (err) {
        console.error("Erro ao buscar dados da landing page:", err);
      }
    };

    fetchDados();
  }, []);

  const handleContratarClick = () => {
    navigate(isAuthenticated ? "/cliente/servicos" : "/login");
  };

  return (
    <div className="landing-page-container">
      {/* Seção 1: Banner de boas-vindas */}
      <section className="landing-banner">
        <img src="/gelson.jpg" alt="Banner" className="landing-banner-img" />
        <div className="landing-banner-content">
            <h1 className="landing-banner-title">Encontre o profissional ideal</h1>
          <div className="landing-banner-cards">
            <div className="landing-banner-card">
              <h3>🛠️ Manutenção Especializada</h3>
              <p>Serviços elétricos, hidráulicos e estruturais realizados com segurança e ferramentas adequadas.</p>
              <button>Ver opções de manutenção</button>
            </div>
            <div className="landing-banner-card">
              <h3>🪛 Instalações Rápidas</h3>
              <p>Montagem de móveis, instalações elétricas e hidráulicas feitas com precisão e sem complicação.</p>
              <button>Agendar instalação</button>
            </div>
            <div className="landing-banner-card">
              <h3>🧱 Reformas com Acabamento Impecável</h3>
              <p>Pintura, aplicação de revestimentos e reparos diversos com atenção aos mínimos detalhes e acabamento profissional.</p>
              <button>Solicitar reforma</button>
            </div>
          </div>
        </div>
      </section>

      {/* Seção 2: Tipos de serviços prestados */}
      <section className="landing-servicos">
        <div className="landing-servicos-content">
          <h2 className="landing-section-title">Serviços Disponíveis</h2>
          <div className="landing-servicos-lista">
            {servicosExibidos.map((servico) => (
              <div key={servico.id} className="landing-servico-card">
                <h3 className="landing-servico-titulo">{servico.nome}</h3>
                <p>{servico.descricao}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="landing-servicos-cta">
        {isAuthenticated && user?.tipo === "CLIENTE" && (
          <Button
            type="button"
            variant="contratar"
            onClick={handleContratarClick}
          >
            Contratar Serviço
          </Button>
        )}
        </div>
      </section>

      {/* Seção 3: Avaliações */}
      <section className="landing-feedbacks">
        <h2 className="landing-section-title">O que dizem sobre nós</h2>
        <div className="landing-feedbacks-lista">
          {avaliacoes.map((fb) => (
            <div key={fb.id} className="landing-feedback-card">
              <p className="landing-feedback-nota">Nota: {fb.nota} / 5</p>
              <p className="landing-feedback-texto">"{fb.comentario}"</p>
              <p className="landing-feedback-autor">– {fb.clienteNome}</p>
              <p className="landing-feedback-data">
                {new Date(fb.dataAvaliacao).toLocaleDateString("pt-BR")}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
