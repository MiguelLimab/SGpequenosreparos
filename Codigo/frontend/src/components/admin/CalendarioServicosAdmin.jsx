import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ModalDetalhesServico from "../ModalDetalhesServico";
import { getItinerario } from "../../services/itinerarioService";

const localizer = momentLocalizer(moment);

const statusInfo = {
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
    <div className="legenda-lista" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      {Object.entries(statusInfo).map(([status, info]) => (
        <div
          key={status}
          className="legenda-item"
          style={{
            backgroundColor: info.color,
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>{info.icon}</span>
          <strong>[{info.label}]</strong> {status}
        </div>
      ))}
    </div>
  </div>
);

const isDataPermitida = (date, itinerario) => {
  const dayOfWeek = date.getDay(); // 0=Domingo, 1=Segunda...
  if (!itinerario) return true;

  if (itinerario.tipoItinerario === "FIXO") {
    return itinerario.diasSemana.includes(dayOfWeek);
  }

  if (itinerario.tipoItinerario === "CICLICO") {
    const inicio = new Date(2025, 0, 1); // base
    const diff = Math.floor((date - inicio) / (1000 * 60 * 60 * 24));
    const ciclo = itinerario.diasTrabalho + itinerario.diasFolga;
    const posicao = diff % ciclo;
    return posicao >= 0 && posicao < itinerario.diasTrabalho;
  }

  return true;
};

const CalendarioServicosAdmin = ({ servicos }) => {
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [itinerario, setItinerario] = useState(null);
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    async function fetchItinerario() {
      try {
        const res = await getItinerario();
        setItinerario(res.data);
      } catch (err) {
        console.error("Erro ao buscar itinerário:", err);
      }
    }
    fetchItinerario();
  }, []);

  const eventos = servicos
    .filter(s =>
      s.data &&
      s.horario &&
      ["ACEITO", "CONCLUIDO"].includes(s.status)
    )
    .map(s => {
      const start = new Date(`${s.data}T${s.horario}`);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      return {
        id: s.id,
        title: s.nome,
        start,
        end,
        status: s.status,
        ...s,
      };
    });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const diasVisiveis = getVisibleDates(date, view);
      document.querySelectorAll(".rbc-day-bg").forEach((element, index) => {
        const dataAtual = diasVisiveis[index];
        if (!dataAtual) return;
        if (!isDataPermitida(dataAtual, itinerario)) {
          element.style.backgroundColor = "#9c4339"; // Visual de bloqueado
        }
      });
    });

    const node = document.querySelector(".rbc-month-view");
    if (node) {
      observer.observe(node, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, [view, date, itinerario]);

  const getVisibleDates = (currentDate, view) => {
    let start = moment(currentDate).startOf(view === "month" ? "month" : "week");
    let end = moment(currentDate).endOf(view === "month" ? "month" : "week");
    const dates = [];
    while (start.isSameOrBefore(end, "day")) {
      dates.push(start.toDate());
      start.add(1, "day");
    }
    return dates;
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        components={{ event: CustomEvent }}
        style={{ height: 600 }}
        onSelectEvent={(event) => setServicoSelecionado(event)}
        onView={setView}
        view={view}
        onNavigate={setDate}
        date={date}
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

export default CalendarioServicosAdmin;
