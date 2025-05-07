import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../css/ServiceCalendar.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

import {
  FaCheck,
  FaTimes,
  FaCalendarCheck,
  FaClipboardList,
  FaHourglassHalf,
  FaClipboard,
} from 'react-icons/fa';

const localizer = momentLocalizer(moment);

const statusInfo = {
  AGENDAMENTO_VISITA: { color: '#6c63ff', icon: <FaCalendarCheck />, label: 'AGV' },
  VISITADO: { color: '#2ecc71', icon: <FaCheck />, label: 'VIS' },
  AGENDAMENTO_FINALIZACAO: { color: '#f39c12', icon: <FaClipboardList />, label: 'AGF' },
  AGUARDANDO_FINALIZACAO: { color: '#e67e22', icon: <FaHourglassHalf />, label: 'AFN' },
  FINALIZADO: { color: '#3498db', icon: <FaClipboard />, label: 'FIN' },
  CANCELADO: { color: '#e74c3c', icon: <FaTimes />, label: 'CAN' },
  REJEITADO: { color: '#c0392b', icon: <FaTimes />, label: 'REJ' },
};

const CustomEvent = ({ event }) => {
  const info = statusInfo[event.status] || {
    color: '#3174ad',
    icon: <FaClipboard />,
    label: 'OUT',
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: info.color,
        color: 'white',
        padding: '4px',
        borderRadius: '4px',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.85rem',
      }}
    >
      {info.icon}
      <span>{event.title.split(' - ')[0]} [{info.label}]</span>
    </div>
  );
};

const LegendaStatus = () => (
  <div style={{ marginTop: '1rem' }}>
    <h4>Legenda de Status</h4>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {Object.entries(statusInfo).map(([status, info]) => (
        <div
          key={status}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: info.color,
            color: 'white',
            padding: '6px 10px',
            borderRadius: '4px',
            fontSize: '0.85rem',
          }}
        >
          {info.icon}
          <strong>[{info.label}]</strong> {status}
        </div>
      ))}
    </div>
  </div>
);

function ServiceCalendar() {
  const [services, setServices] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const buscarServicos = () => {
    axios.get("http://localhost:8081/admin/service/api", { withCredentials: true })
      .then((res) => {
        const formatted = res.data.map(service => {
          const start = new Date(`${service.visitDate}T${service.visitTime}`);
          const end = new Date(start.getTime() + 60 * 60 * 1000); // 1h

          return {
            id: service.id,
            title: `${service.serviceType} - ${service.status}`,
            start,
            end,
            status: service.status,
          };
        });
        setServices(formatted);
      })
      .catch((error) => {
        console.error("Erro ao buscar serviços:", error);
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/user/role", { withCredentials: true })
      .then((res) => {
        setIsAdmin(res.data === "ROLE_ADMIN");
        buscarServicos();
      })
      .catch((err) => {
        console.error("Erro ao verificar papel do usuário:", err);
        buscarServicos(); // tenta mesmo com erro
      });
  }, []);

  return (
    <div className="calendar-container">
      <nav className="navbar">
        <div className="navbar-title">
          <Link to="/home">SG Pequenos Reparos</Link>
        </div>
        <div className="navbar-links">
          {isAdmin && (
            <>
              <Link to="/admin" className="admin-link">Painel ADM</Link>
              <Link to="/calendar" className="admin-link">Calendário</Link>
            </>
          )}
          <Link to="/service">Serviços</Link>
          <Link to="/perfil">Perfil</Link>
          <button onClick={handleLogout}>Sair</button>
        </div>
      </nav>

      <h2>Calendário de Serviços</h2>
      <Calendar
        localizer={localizer}
        events={services}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        style={{ height: 600 }}
        components={{ event: CustomEvent }}
        messages={{
          next: "Próximo",
          previous: "Anterior",
          today: "Hoje",
          month: "Mês",
          week: "Semana",
          day: "Dia",
          agenda: "Agenda"
        }}
      />
      <LegendaStatus />
    </div>
  );
}

export default ServiceCalendar;
