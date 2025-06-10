import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { listarTipos } from "../services/tipoService";
import { listarAvaliacoes } from "../services/avaliacaoService";
import Button from "../components/Button";

import "../styles/pages/LandingPage.css";

const LandingPage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [servicos, setServicos] = useState([]);
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
        <h1 className="landing-banner-title">
          Bem-vindo ao SG Pequenos Reparos
        </h1>
        <p className="landing-banner-subtitle">
          Encontre o profissional ideal para pequenos reparos na sua casa com
          agilidade e confiança.
        </p>
      </section>

      {/* Seção 2: Tipos de serviços prestados */}
      <section className="landing-servicos">
        <h2 className="landing-section-title">Serviços Disponíveis</h2>
        <div className="landing-servicos-lista">
          {servicos.map((servico) => (
            <div key={servico.id} className="landing-servico-card">
              <h3 className="landing-servico-titulo">{servico.nome}</h3>
              <p>{servico.descricao}</p>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="contratar"
          onClick={handleContratarClick}
        >
          Contratar Serviço
        </Button>
      </section>

      {/* Seção 3: Avaliações */}
      <section className="landing-feedbacks">
        <h2 className="landing-section-title">O que dizem sobre nós</h2>
        <div className="landing-feedbacks-lista">
          {avaliacoes.map((fb) => (
            <div key={fb.id} className="landing-feedback-card">
              <p className="landing-feedback-nota">Nota: {fb.nota} / 5</p>
              <p className="landing-feedback-texto">"{fb.comentario}"</p>
              <p className="landing-feedback-autor">– {fb.nomeCliente}</p>
              <p className="landing-feedback-data">
                {new Date(fb.dataCriacao).toLocaleDateString("pt-BR")}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
