import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CalendarioServicosAdmin from "../../components/admin/CalendarioServicosAdmin";
import ListaServicosAdmin from "../../components/admin/ListaServicosAdmin";
import { listarServicos } from "../../services/servicoService";
import Button from "../../components/Button";
import "../../styles/pages/ServicosPage.css";

const ServicoAdminPage = () => {
  const [servicos, setServicos] = useState([]);

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

  const handleServicoAtualizado = () => {
    fetchServicos();
  };

  return (
    <div className="servicos-page-container">
      {/* Calendário */}
      <div className="servicos-calendar">
        <CalendarioServicosAdmin servicos={servicos} />
      </div>

      {/* Lista e botões */}
      <div className="servicos-content">
        <div className="servicos-lista">
          <ListaServicosAdmin
            servicos={servicos}
            onServicoAtualizado={handleServicoAtualizado}
          />
        </div>

        <div className="servicos-buttons">
          <Link
            to="/cliente/historico"
            className="btn-component btn-link-button"
          >
            Histórico de Serviços
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServicoAdminPage;
