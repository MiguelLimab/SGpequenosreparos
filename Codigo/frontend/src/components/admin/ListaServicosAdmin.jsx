import { useState } from "react";
import ModalAgendarServico from "./ModalAgendarServico"; // importa o modal
import {
  concluirServico,
  cancelarServico,
  recusarServico
} from "../../services/servicoService"; // importa os services

const ListaServicosAdmin = ({ servicos, onServicoAtualizado }) => {
  const [cancelandoId, setCancelandoId] = useState(null);
  const [concluindoId, setConcluindoId] = useState(null);

  const [servicoSelecionado, setServicoSelecionado] = useState(null); // para abrir o modal

  const solicitados = servicos.filter((s) => s.status === "SOLICITADO");
  const aceitos = servicos.filter((s) => s.status === "ACEITO");
  const concluidos = servicos.filter((s) => s.status === "CONCLUIDO");
  const cancelados = servicos.filter((s) => s.status === "CANCELADO");

  const handleAbrirModal = (servico) => {
    setServicoSelecionado(servico); // abre o modal com o serviço selecionado
  };

  const handleFecharModal = () => {
    setServicoSelecionado(null); // fecha o modal
  };

  const handleRecusar = async (id) => {
    if (window.confirm("Tem certeza que deseja recusar este serviço?")) {
      try {
        await recusarServico(id);
        alert('Serviço recusado com sucesso!');
        onServicoAtualizado();
      } catch (error) {
        console.error('Erro ao recusar serviço:', error);
        alert('Erro ao recusar serviço.');
      }
    }
  };

  const handleCancelar = async (id) => {
    const motivo = prompt("Digite o motivo do cancelamento:");
    if (!motivo) {
      alert("Cancelamento abortado. Motivo é obrigatório.");
      return;
    }

    setCancelandoId(id);
    try {
      await cancelarServico(id, motivo);
      alert("Serviço cancelado com sucesso!");
      onServicoAtualizado();
    } catch (error) {
      console.error("Erro ao cancelar serviço:", error);
      alert("Erro ao cancelar serviço.");
    } finally {
      setCancelandoId(null);
    }
  };

  const handleConcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja concluir este serviço?")) {
      setConcluindoId(id);
      try {
        await concluirServico(id);
        alert("Serviço concluído com sucesso!");
        onServicoAtualizado();
      } catch (error) {
        console.error("Erro ao concluir serviço:", error);
        alert("Erro ao concluir serviço.");
      } finally {
        setConcluindoId(null);
      }
    }
  };

  return (
    <div>
      <h2>Serviços Solicitados</h2>
      {solicitados.length === 0 ? (
        <p>Não há serviços solicitados.</p>
      ) : (
        solicitados.map((servico) => (
          <div key={servico.id}>
            <h4>{servico.nome}</h4>
            <p><strong>Cliente:</strong> {servico.clienteNome}</p>
            <p><strong>Email:</strong> {servico.emailContato}</p>
            <p><strong>Telefone:</strong> {servico.telefoneContato}</p>
            <p><strong>Descrição:</strong> {servico.descricao}</p>
            <div>
              <button onClick={() => handleAbrirModal(servico)}>
                Aceitar
              </button>
              <button
                onClick={() => handleRecusar(servico.id)}
                style={{ marginLeft: "10px" }}
              >
                Recusar
              </button>
            </div>
          </div>
        ))
      )}

      <h2>Serviços Aceitos</h2>
      {aceitos.length === 0 ? (
        <p>Não há serviços aceitos.</p>
      ) : (
        aceitos.map((servico) => (
          <div key={servico.id}>
            <h4>{servico.nome}</h4>
            <p><strong>Cliente:</strong> {servico.clienteNome}</p>
            <p><strong>Data:</strong> {servico.data ? new Date(servico.data).toLocaleDateString() : 'Não agendado'}</p>
            <p><strong>Horário:</strong> {servico.horario || 'Não agendado'}</p>
            <div>
              <button
                onClick={() => handleConcluir(servico.id)}
                disabled={concluindoId === servico.id}
              >
                {concluindoId === servico.id ? "Concluindo..." : "Concluir"}
              </button>
              <button
                onClick={() => handleCancelar(servico.id)}
                disabled={cancelandoId === servico.id}
                style={{ marginLeft: "10px" }}
              >
                {cancelandoId === servico.id ? "Cancelando..." : "Cancelar"}
              </button>
            </div>
          </div>
        ))
      )}

      <h2>Serviços Concluídos</h2>
      {concluidos.length === 0 ? (
        <p>Não há serviços concluídos.</p>
      ) : (
        concluidos.map((servico) => (
          <div key={servico.id}>
            <h4>{servico.nome}</h4>
            <p>Status: {servico.status}</p>
          </div>
        ))
      )}

      <h2>Serviços Cancelados</h2>
      {cancelados.length === 0 ? (
        <p>Não há serviços cancelados.</p>
      ) : (
        cancelados.map((servico) => (
          <div key={servico.id}>
            <h4>{servico.nome}</h4>
            <p>Status: {servico.status}</p>
          </div>
        ))
      )}

      {/* Modal de Agendamento */}
      {servicoSelecionado && (
        <ModalAgendarServico
          servico={servicoSelecionado}
          onClose={handleFecharModal}
          onServicoAtualizado={onServicoAtualizado}
        />
      )}
    </div>
  );
};

export default ListaServicosAdmin;
