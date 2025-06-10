import { useState } from 'react';
import { cancelarServico } from '../services/servicoService';
import CardServico from './CardServico';
import ModalAvaliacaoServico from './ModalAvaliacaoServico'; // ✅ NOVO

const ListaServicosCliente = ({ servicos, onServicoAtualizado }) => {
  const [cancelandoId, setCancelandoId] = useState(null);
  const [modalAvaliacao, setModalAvaliacao] = useState(false); // ✅ NOVO
  const [servicoSelecionado, setServicoSelecionado] = useState(null); // ✅ NOVO

  const handleCancelar = async (id) => {
    const motivo = prompt('Digite o motivo do cancelamento:');
    if (!motivo) {
      alert('Cancelamento abortado. Motivo é obrigatório.');
      return;
    }

    setCancelandoId(id);
    try {
      await cancelarServico(id, motivo);
      alert('Serviço cancelado com sucesso!');
      onServicoAtualizado?.();
    } catch (error) {
      console.error('Erro ao cancelar serviço:', error);
      alert('Erro ao cancelar serviço.');
    } finally {
      setCancelandoId(null);
    }
  };

  const handleAvaliar = (servico) => {
    setServicoSelecionado(servico);
    setModalAvaliacao(true);
  };

  const solicitados = servicos.filter(s => s.status === 'SOLICITADO');
  const agendados = servicos.filter(s => s.status === 'ACEITO' && s.data && s.horario);
  const concluidos = servicos.filter(s => s.status === 'CONCLUIDO');

  return (
    <div>
      <h2>Minhas Solicitações</h2>

      <section>
        <h3>Serviços Solicitados</h3>
        {solicitados.length === 0 ? (
          <p>Você não tem serviços solicitados.</p>
        ) : (
          solicitados.map(servico => (
            <CardServico
              key={servico.id}
              servico={servico}
              tipo="solicitado"
              onCancelar={() => handleCancelar(servico.id)}
              cancelando={cancelandoId === servico.id}
            />
          ))
        )}
      </section>

      <section style={{ marginTop: '30px' }}>
        <h3>Serviços Agendados</h3>
        {agendados.length === 0 ? (
          <p>Você não tem serviços agendados.</p>
        ) : (
          agendados.map(servico => (
            <CardServico
              key={servico.id}
              servico={servico}
              tipo="agendado"
            />
          ))
        )}
      </section>

      <section style={{ marginTop: '30px' }}>
        <h3>Serviços Concluídos</h3>
        {concluidos.length === 0 ? (
          <p>Você ainda não tem serviços concluídos.</p>
        ) : (
          concluidos.map(servico => (
            <div key={servico.id} style={{ marginBottom: '15px' }}>
              <CardServico
                servico={servico}
                tipo="concluido"
              />
              <button
                style={{ marginTop: '8px', backgroundColor: '#28a745', color: 'white' }}
                onClick={() => handleAvaliar(servico)}
              >
                Avaliar
              </button>
            </div>
          ))
        )}
      </section>

      {/* ✅ Modal de Avaliação */}
      {modalAvaliacao && servicoSelecionado && (
        <ModalAvaliacaoServico
          isOpen={modalAvaliacao}
          onClose={() => setModalAvaliacao(false)}
          servico={servicoSelecionado}
          onAvaliado={onServicoAtualizado}
        />
      )}
    </div>
  );
};

export default ListaServicosCliente;
