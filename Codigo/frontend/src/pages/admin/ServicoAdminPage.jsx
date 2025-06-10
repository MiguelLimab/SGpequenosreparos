import { useState, useEffect } from 'react';
import CalendarioServicosAdmin from '../../components/admin/CalendarioServicosAdmin';
import ListaServicosAdmin from '../../components/admin/ListaServicosAdmin';
import { listarServicos } from '../../services/servicoService'; // 🆕
import { Link } from 'react-router-dom';
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
      console.error('Erro ao buscar serviços:', error);
    }
  };

  const handleServicoAtualizado = () => {
    fetchServicos();
  };

  return (
    <div className="servicos-page" style={{ display: 'flex', gap: '20px' }}>
      {/* Calendário */}
      <div style={{ flex: 1 }}>
        <CalendarioServicosAdmin servicos={servicos} />
      </div>

      {/* Lista */}
      <div style={{ flex: 1 }}>
        <ListaServicosAdmin
          servicos={servicos}
          onServicoAtualizado={handleServicoAtualizado}
        />
        <Link to="/cliente/historico">
          <button style={{ marginTop: '10px' }}>
            Histórico de Serviços
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ServicoAdminPage;
