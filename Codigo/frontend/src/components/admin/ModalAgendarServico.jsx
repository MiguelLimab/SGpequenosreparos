import { useState, useEffect } from "react";
import { aceitarServico } from "../../services/servicoService";
import { getUserProfile } from "../../services/authService";
import { getItinerario } from "../../services/itinerarioService";
import "../../styles/components/ModalAgendarServico.css";
import Input from "../Input";
import Label from "../Label";
import Button from "../Button";

const ModalAgendarServico = ({ servico, onClose, onServicoAtualizado }) => {
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [loading, setLoading] = useState(false);
  const [itinerario, setItinerario] = useState(null);

  useEffect(() => {
    const fetchItinerario = async () => {
      try {
        const response = await getItinerario();
        setItinerario(response.data);
      } catch (err) {
        console.error("Erro ao carregar itinerário:", err);
      }
    };
    fetchItinerario();
  }, []);

  const diaSemanaToEnum = (dia) => {
    const map = {
      0: "DOMINGO",
      1: "SEGUNDA",
      2: "TERCA",
      3: "QUARTA",
      4: "QUINTA",
      5: "SEXTA",
      6: "SABADO",
    };
    return map[dia];
  };

  const diaSemanaToNumero = (dia) => {
    const map = {
      0: 1, // DOMINGO
      1: 2, // SEGUNDA
      2: 3, // TERCA
      3: 4, // QUARTA
      4: 5, // QUINTA
      5: 6, // SEXTA
      6: 7, // SABADO
    };
    return map[dia];
  };

  const getPeriodo = (horario) => {
    const [hora] = horario.split(":").map(Number);
    if (hora >= 6 && hora < 12) return "MANHA";
    if (hora >= 12 && hora < 18) return "TARDE";
    return "NOITE";
  };

  const handleAgendar = async () => {
    if (!data || !horario) {
      alert("Por favor, preencha a data e o horário.");
      return;
    }

    const [ano, mes, dia] = data.split("-").map(Number);
    const dataSelecionada = new Date(ano, mes - 1, dia); // sem timezone incorreto

    const diaEnum = diaSemanaToEnum(dataSelecionada.getDay());
    const diaNumerico = diaSemanaToNumero(dataSelecionada.getDay());

    // Valida itinerário do admin
    if (itinerario) {
      if (itinerario.tipoItinerario === "FIXO") {
        if (!itinerario.diasSemana.includes(diaNumerico)) {
          alert("Este dia não está no itinerário do profissional.");
          return;
        }
      } else if (itinerario.tipoItinerario === "CICLICO") {
        const inicio = new Date(2025, 0, 1);
        const diff = Math.floor(
          (dataSelecionada - inicio) / (1000 * 60 * 60 * 24)
        );
        const ciclo = itinerario.diasTrabalho + itinerario.diasFolga;
        if (diff % ciclo >= itinerario.diasTrabalho) {
          alert("Este dia está fora do ciclo de trabalho do profissional.");
          return;
        }
      }
    }

    // Valida disponibilidade do cliente (dia)
    if (!servico.diasDisponiveisCliente.includes(diaEnum)) {
      alert(`O cliente não está disponível na ${diaEnum}.`);
      return;
    }

    // Valida disponibilidade do cliente (turno)
    const periodoSelecionado = getPeriodo(horario);
    if (periodoSelecionado !== servico.periodoDisponivelCliente) {
      alert(
        `O cliente está disponível apenas no período ${servico.periodoDisponivelCliente}.`
      );
      return;
    }

    setLoading(true);
    try {
      const admin = await getUserProfile();
      await aceitarServico(servico.id, admin.id, data, horario);
      alert("Serviço agendado com sucesso!");
      onServicoAtualizado();
      onClose();
    } catch (error) {
      console.error("Erro ao agendar serviço:", error);
      alert("Erro ao agendar serviço.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Agendar Serviço</h2>
        <p>
          <strong>Serviço:</strong> {servico.nome}
        </p>
        <p>
          <strong>Cliente:</strong> {servico.clienteNome}
        </p>
        <p>
          <strong>Dias Disponíveis:</strong>{" "}
          {servico.diasDisponiveisCliente.join(", ")}
        </p>
        <p>
          <strong>Turno Disponível:</strong> {servico.periodoDisponivelCliente}
        </p>

        <Input
          label="Data"
          type="date"
          name="data"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
        <Input
          label="Horário"
          type="time"
          name="horario"
          value={horario}
          onChange={(e) => setHorario(e.target.value)}
        />

        <div className="modal-buttons">
          <Button onClick={handleAgendar} disabled={loading}>
            {loading ? "Agendando..." : "Agendar"}
          </Button>
          <Button variant="cancelar" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalAgendarServico;
