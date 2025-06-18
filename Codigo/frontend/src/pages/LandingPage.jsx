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

  const [servicos, setServicos] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);

  const [paginaServicos, setPaginaServicos] = useState(1);
  const [paginaAvaliacoes, setPaginaAvaliacoes] = useState(1);
  const porPagina = 6;

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

  const servicosExibidos = servicos.slice(
    (paginaServicos - 1) * porPagina,
    paginaServicos * porPagina
  );
  const avaliacoesExibidas = avaliacoes.slice(
    (paginaAvaliacoes - 1) * porPagina,
    paginaAvaliacoes * porPagina
  );

  const totalPaginasServicos = Math.ceil(servicos.length / porPagina);
  const totalPaginasAvaliacoes = Math.ceil(avaliacoes.length / porPagina);

  const Paginacao = ({ paginaAtual, totalPaginas, aoMudar }) => (
    <div className="landing-paginacao">
      <button
        disabled={paginaAtual === 1}
        onClick={() => aoMudar(paginaAtual - 1)}
      >
        ◀
      </button>
      <span>
        {paginaAtual} / {totalPaginas}
      </span>
      <button
        disabled={paginaAtual === totalPaginas}
        onClick={() => aoMudar(paginaAtual + 1)}
      >
        ▶
      </button>
    </div>
  );

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
          <Paginacao
            paginaAtual={paginaServicos}
            totalPaginas={totalPaginasServicos}
            aoMudar={setPaginaServicos}
          />
        </div>
        {isAuthenticated && user?.tipo === "CLIENTE" && (
          <Button
            type="button"
            variant="contratar"
            onClick={handleContratarClick}
          >
            Contratar Serviço
          </Button>
        )}

      </section>

      {/* Seção 3: Avaliações */}
      <section className="landing-feedbacks" style={{ display: "none" }}>
        <h2 className="landing-section-title">O que dizem sobre nós</h2>
        <div className="landing-feedbacks-lista">
          {avaliacoesExibidas.map((fb) => (
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
        <Paginacao
          paginaAtual={paginaAvaliacoes}
          totalPaginas={totalPaginasAvaliacoes}
          aoMudar={setPaginaAvaliacoes}
        />
      </section>
    </div>
  );
};

export default LandingPage;
