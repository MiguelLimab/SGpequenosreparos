import { useState } from "react";
import ModalAgendarServico from "./ModalAgendarServico";
import ModalCancelarServico from "../ModalCancelarServico";
import Button from "../Button";
import CardServico from "../CardServico";
import {
  concluirServico,
  cancelarServico,
  recusarServico,
} from "../../services/servicoService";
import "../../styles/components/ListaServicosCliente.css";
import { toast } from "react-toastify";
import ModalConfirmarRecusa from "../ModalConfirmarRecusa";
import ModalConfirmarConclusao from "../ModalConfirmarConclusao";

const ListaServicosAdmin = ({ servicos, onServicoAtualizado }) => {
  const [cancelandoId, setCancelandoId] = useState(null);
  const [concluindoId, setConcluindoId] = useState(null);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);

  // Novo modal concluir
  const [mostrarModalConcluir, setMostrarModalConcluir] = useState(false);
  const [concluirId, setConcluirId] = useState(null);
  const [concluindo, setConcluindo] = useState(false);

  // Novo modal cancelamento
  const [mostrarModalCancelar, setMostrarModalCancelar] = useState(false);
  const [idSelecionado, setIdSelecionado] = useState(null);
  const [cancelando, setCancelando] = useState(false);

  // Novo modal recusar
  const [mostrarModalRecusar, setMostrarModalRecusar] = useState(false);
  const [recusandoId, setRecusandoId] = useState(null);

  const solicitados = servicos.filter((s) => s.status === "SOLICITADO");
  const aceitos = servicos.filter((s) => s.status === "ACEITO");
  const concluidos = servicos.filter((s) => s.status === "CONCLUIDO");
  const cancelados = servicos.filter((s) => s.status === "CANCELADO");

  const handleAbrirModal = (servico) => {
    setServicoSelecionado(servico);
  };

  const handleFecharModal = () => {
    setServicoSelecionado(null);
  };

  const iniciarCancelamento = (id) => {
    setIdSelecionado(id);
    setMostrarModalCancelar(true);
  };

  const confirmarCancelamento = async (motivo) => {
    setCancelando(true);
    try {
      await cancelarServico(idSelecionado, motivo);
      toast.success("Serviço cancelado com sucesso!");
      onServicoAtualizado();
    } catch (error) {
      toast.error("Erro ao cancelar serviço.");
    } finally {
      setCancelando(false);
      setMostrarModalCancelar(false);
      setIdSelecionado(null);
    }
  };

  const iniciarRecusa = (id) => {
    setRecusandoId(id);
    setMostrarModalRecusar(true);
  };

  const confirmarRecusa = async () => {
    try {
      await recusarServico(recusandoId);
      toast.success("Serviço recusado com sucesso!");
      onServicoAtualizado();
    } catch (error) {
      toast.error("Erro ao recusar serviço.");
    } finally {
      setMostrarModalRecusar(false);
      setRecusandoId(null);
    }
  };

  const iniciarConclusao = (id) => {
    setConcluirId(id);
    setMostrarModalConcluir(true);
  };

  const confirmarConclusao = async () => {
    setConcluindo(true);
    try {
      await concluirServico(concluirId);
      toast.success("Serviço concluído com sucesso!");
      onServicoAtualizado();
    } catch (error) {
      toast.error("Erro ao concluir serviço.");
    } finally {
      setMostrarModalConcluir(false);
      setConcluirId(null);
      setConcluindo(false);
    }
  };

  const renderServico = (servico, tipo) => (
    <div key={servico.id} className="lista-servicos-card">
      <CardServico servico={servico} tipo={tipo} />
      {tipo === "solicitado" && (
        <div className="lista-servicos-botoes">
          <Button variant="aceitar" onClick={() => handleAbrirModal(servico)}>
            Aceitar
          </Button>
          <Button variant="recusar" onClick={() => iniciarRecusa(servico.id)}>
            Recusar
          </Button>
        </div>
      )}
      {tipo === "aceito" && (
        <div className="lista-servicos-botoes">
          <Button
            variant="concluir"
            onClick={() => iniciarConclusao(servico.id)}
          >
            Concluir
          </Button>

          <Button
            variant="cancelar"
            onClick={() => iniciarCancelamento(servico.id)}
            disabled={cancelandoId === servico.id}
          >
            {cancelandoId === servico.id ? "Cancelando..." : "Cancelar"}
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="lista-servicos-container">
      <h2 className="lista-servicos-titulo">Gerenciar Serviços</h2>

      <section className="lista-servicos-bloco">
        <h3 className="lista-servicos-subtitulo">Solicitados</h3>
        <div className="lista-servicos-scroll">
          {solicitados.length === 0 ? (
            <p className="lista-servicos-vazio">Nenhum serviço solicitado.</p>
          ) : (
            solicitados.map((s) => renderServico(s, "solicitado"))
          )}
        </div>
      </section>

      <section className="lista-servicos-bloco">
        <h3 className="lista-servicos-subtitulo">Agendados</h3>
        <div className="lista-servicos-scroll">
          {aceitos.length === 0 ? (
            <p className="lista-servicos-vazio">Nenhum serviço agendado.</p>
          ) : (
            aceitos.map((s) => renderServico(s, "aceito"))
          )}
        </div>
      </section>

      <section className="lista-servicos-bloco">
        <h3 className="lista-servicos-subtitulo">Concluídos</h3>
        <div className="lista-servicos-scroll">
          {concluidos.length === 0 ? (
            <p className="lista-servicos-vazio">Nenhum serviço concluído.</p>
          ) : (
            concluidos.map((servico) => (
              <div key={servico.id} className="lista-servicos-card">
                <CardServico servico={servico} tipo="concluido" />
              </div>
            ))
          )}
        </div>
      </section>

      <section className="lista-servicos-bloco">
        <h3 className="lista-servicos-subtitulo">Cancelados</h3>
        <div className="lista-servicos-scroll">
          {cancelados.length === 0 ? (
            <p className="lista-servicos-vazio">Nenhum serviço cancelado.</p>
          ) : (
            cancelados.map((servico) => (
              <div key={servico.id} className="lista-servicos-card">
                <CardServico servico={servico} tipo="cancelado" />
              </div>
            ))
          )}
        </div>
      </section>

      {servicoSelecionado && (
        <ModalAgendarServico
          servico={servicoSelecionado}
          onClose={handleFecharModal}
          onServicoAtualizado={onServicoAtualizado}
        />
      )}

      {mostrarModalCancelar && (
        <ModalCancelarServico
          onConfirmar={confirmarCancelamento}
          onClose={() => setMostrarModalCancelar(false)}
          loading={cancelando}
        />
      )}
      {mostrarModalRecusar && (
        <ModalConfirmarRecusa
          onConfirmar={confirmarRecusa}
          onClose={() => setMostrarModalRecusar(false)}
          loading={false}
        />
      )}
      {mostrarModalConcluir && (
        <ModalConfirmarConclusao
          onConfirmar={confirmarConclusao}
          onClose={() => setMostrarModalConcluir(false)}
          loading={concluindo}
        />
      )}
    </div>
  );
};

export default ListaServicosAdmin;
