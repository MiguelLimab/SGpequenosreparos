import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CalendarioServicos from '../components/CalendarioServicos';
import ListaServicosCliente from '../components/ListaServicosCliente';
import ModalSolicitarServico from '../components/ModalSolicitarServico';
import { listarServicos } from '../services/servicoService'; // 🆕 Usa o service

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
      console.error('Erro ao buscar serviços:', error);
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
    <div className="servicos-page" style={{ display: 'flex', gap: '20px' }}>
      {/* Calendário */}
      <div style={{ flex: 1 }}>
        <CalendarioServicos servicos={servicos} />
      </div>

      {/* Lista e Botão */}
      <div style={{ flex: 1 }}>
        <ListaServicosCliente 
          servicos={servicos} 
          onServicoAtualizado={fetchServicos} // 🆕 passa a função de atualizar
        />

        <button onClick={handleAbrirModal} style={{ marginTop: '20px' }}>
          Solicitar Novo Serviço
        </button>

        <Link to="/cliente/historico">
          <button style={{ marginTop: '10px' }}>
            Histórico de Serviços
          </button>
        </Link>

        {/* Modal */}
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
