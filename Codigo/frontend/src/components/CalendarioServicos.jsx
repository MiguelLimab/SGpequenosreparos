import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ModalDetalhesServico from "./ModalDetalhesServico";

const localizer = momentLocalizer(moment);

const statusInfo = {
  SOLICITADO: { color: "#3498db", icon: "📝", label: "SOL" },
  ACEITO: { color: "#2ecc71", icon: "✅", label: "ACE" },
  CONCLUIDO: { color: "#27ae60", icon: "🏁", label: "CON" },
  CANCELADO: { color: "#e74c3c", icon: "❌", label: "CAN" },
  RECUSADO: { color: "#c0392b", icon: "🚫", label: "REC" },
};

const CustomEvent = ({ event }) => {
  const info = statusInfo[event.status] || {
    color: "#7f8c8d",
    icon: "📄",
    label: "OUT",
  };

  return (
    <div
      style={{
        backgroundColor: info.color,
        color: "white",
        padding: "4px",
        borderRadius: "4px",
        boxSizing: "border-box",
        fontSize: "0.85rem",
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <span>{info.icon}</span>
      <span>{event.title} [{info.label}]</span>
    </div>
  );
};

const LegendaStatus = () => (
  <div className="legenda-status">
    <h4>Legenda de Status</h4>
    <div className="legenda-lista">
      {Object.entries(statusInfo).map(([status, info]) => (
        <div key={status} className="legenda-item" style={{ backgroundColor: info.color }}>
          <span>{info.icon}</span>
          <strong>[{info.label}]</strong> {status}
        </div>
      ))}
    </div>
  </div>
);

const CalendarioServicos = ({ servicos }) => {
  const [servicoSelecionado, setServicoSelecionado] = useState(null);

  const eventos = servicos
    .filter(servico => 
      servico.data && servico.horario && 
      (servico.status === "ACEITO" || servico.status === "CONCLUIDO")
    )
    .map(servico => {
      const start = new Date(`${servico.data}T${servico.horario}`);
      const end = new Date(start.getTime() + 60 * 60 * 1000);

      return {
        id: servico.id,
        title: servico.nome,
        start,
        end,
        status: servico.status,
        ...servico, // Passa todos os dados
      };
    });

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        components={{
          event: CustomEvent,
        }}
        onSelectEvent={(event) => setServicoSelecionado(event)}
        messages={{
          next: "Próximo",
          previous: "Anterior",
          today: "Hoje",
          month: "Mês",
          week: "Semana",
          day: "Dia",
          agenda: "Agenda",
        }}
      />
      <LegendaStatus />

      {servicoSelecionado && (
        <ModalDetalhesServico
          servico={servicoSelecionado}
          onClose={() => setServicoSelecionado(null)}
        />
      )}
    </div>
  );
};

export default CalendarioServicos;
