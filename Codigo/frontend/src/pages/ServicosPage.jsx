import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CalendarioServicos from "../components/CalendarioServicos";
import ListaServicosCliente from "../components/ListaServicosCliente";
import ModalSolicitarServico from "../components/ModalSolicitarServico";
import { listarServicos } from "../services/servicoService";
import "../styles/pages/ServicosPage.css"; // Importando o CSS da página
import Button from "../components/Button";

const ServicosPage = () => {
  const [servicos, setServicos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchServicos();
  }, []);

  const fetchServicos = async () => {
    try {
      const response = await listarServicos();
      setServicos(response.data);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    }
  };

  const handleAbrirModal = () => {
    setIsModalOpen(true);
  };

  const handleFecharModal = () => {
    setIsModalOpen(false);
  };

  const handleServicoCriado = () => {
    fetchServicos(); // Atualiza a lista após novo serviço criado
    handleFecharModal();
  };

  return (
    <div className="servicos-page-container">
      {/* Calendário */}
      <div className="servicos-calendar">
        <CalendarioServicos servicos={servicos} />
      </div>

      {/* Lista e Modal */}
      <div className="servicos-content">
            <div className="servicos-lista">
              <ListaServicosCliente
                servicos={servicos}
                onServicoAtualizado={fetchServicos}
              />
            </div>

            <div className="servicos-buttons">
              <Button variant="contratar" onClick={handleAbrirModal}>
                Solicitar Novo Serviço
              </Button>

              <Link
                to="/cliente/historico"
                className="btn-component btn-link-button"
              >
                Histórico de Serviços
              </Link>
            </div>

        {isModalOpen && (
          <ModalSolicitarServico
            onClose={handleFecharModal}
            onServicoCriado={handleServicoCriado}
          />
        )}
      </div>
    </div>
  );
};

export default ServicosPage;
