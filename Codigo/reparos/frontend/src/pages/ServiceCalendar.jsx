import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import {
  FaClock,
  FaCheck,
  FaTimes,
  FaCalendarCheck,
  FaClipboardList,
  FaHourglassHalf,
  FaClipboard,
} from 'react-icons/fa';

const localizer = momentLocalizer(moment);

const handleLogout = () => {
  // Limpar dados do usuário (localStorage, cookies, etc) se necessário
  navigate("/");
};

// Mapa de cores, ícones e siglas por status
const statusInfo = {
  AGENDAMENTO_VISITA: { color: '#6c63ff', icon: <FaCalendarCheck />, label: 'AGV' },
  VISITADO: { color: '#2ecc71', icon: <FaCheck />, label: 'VIS' },
  AGENDAMENTO_FINALIZACAO: { color: '#f39c12', icon: <FaClipboardList />, label: 'AGF' },
  AGUARDANDO_FINALIZACAO: { color: '#e67e22', icon: <FaHourglassHalf />, label: 'AFN' },
  FINALIZADO: { color: '#3498db', icon: <FaClipboard />, label: 'FIN' },
  CANCELADO: { color: '#e74c3c', icon: <FaTimes />, label: 'CAN' },
  REJEITADO: { color: '#c0392b', icon: <FaTimes />, label: 'REJ' },
};

// Componente customizado para eventos
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

// Legenda de status
const LegendaStatus = () => {
  return (
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
};

function ServiceCalendar() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch('/admin/service/api')
      .then(response => {
        if (!response.ok) {
          throw new Error("Erro ao carregar serviços");
        }
        return response.json();
      })
      .then(data => {
        const formatted = data.map(service => {
          const start = new Date(`${service.visitDate}T${service.visitTime}`);
          const end = new Date(start.getTime() + 60 * 60 * 1000); // duração de 1h

          return {
            id: service.id,
            title: `${service.serviceType} - ${service.status}`,
            start,
            end,
            status: service.status, // usado para estilo
          };
        });

        setServices(formatted);
      })
      .catch(error => console.error(error));
  }, []);
  return (
    <div style={{ display: 'flex', maxWidth: '1200px', margin: 'auto', padding: '1rem', gap: '1rem' }}>
      {/* Coluna do Calendário */}
      <div style={{ flex: 2 }}>
        <h2>Calendário de Serviços</h2>
        <Calendar
          localizer={localizer}
          events={services}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          components={{ event: CustomEvent }}
          messages={{
            next: "Próximo",
            previous: "Anterior",
            today: "Hoje",
            month: "Mês",
            week: "Semana",
            day: "Dia",
          }}
        />
        <LegendaStatus />
      </div>
  
      {/* Coluna da Lista */}
      <div style={{
        flex: 1,
        backgroundColor: '#f8f8f8',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '1rem',
        overflowY: 'auto',
        maxHeight: '700px'
      }}>
        <h3 style={{ marginBottom: '1rem' }}>Lista de Serviços</h3>
        {services.length === 0 ? (
          <p>Nenhum serviço encontrado.</p>
        ) : (
          services.map(service => {
            const info = statusInfo[service.status] || {
              color: '#888',
              icon: <FaClipboard />,
              label: 'OUT',
            };
  
            return (
              <div key={service.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#fff',
                border: `2px solid ${info.color}`,
                borderRadius: '6px',
                padding: '0.75rem',
                marginBottom: '0.75rem',
              }}>
                <div>
                  <strong>{service.title.split(' - ')[0]}</strong><br />
                  <small>
                    {moment(service.start).format('DD/MM/YYYY')} às {moment(service.start).format('HH:mm')}
                  </small>
                </div>
                <div style={{ fontSize: '1.2rem', color: info.color }} title={service.status}>
                  {info.icon}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
  
}

export default ServiceCalendar;
