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
import { Bell } from 'lucide-react'; // Ícone de sino para notificações

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

function isDataPermitida(date) {
  const inicio = new Date(2025, 0, 1);
  const diffTime = date - inicio;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const ciclo = diffDays % 8;
  return ciclo >= 0 && ciclo <= 3;
}

function getVisibleDates(currentDate, view) {
  let start, end;

  if (view === 'month') {
    start = moment(currentDate).startOf('month').startOf('week');
    end = moment(currentDate).endOf('month').endOf('week');
  } else if (view === 'week') {
    start = moment(currentDate).startOf('week');
    end = moment(currentDate).endOf('week');
  } else if (view === 'day') {
    start = moment(currentDate).startOf('day');
    end = moment(currentDate).endOf('day');
  } else {
    start = moment(currentDate).startOf('week');
    end = moment(currentDate).endOf('week');
  }

  const dates = [];
  const day = start.clone();

  while (day.isBefore(end, 'day') || day.isSame(end, 'day')) {
    dates.push(day.clone().toDate());
    day.add(1, 'day');
  }

  return dates;
}

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
        backgroundColor: isDataPermitida(event.start) ? info.color : '#ccc',
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const buscarNotificacoes = () => {
    axios.get("http://localhost:8081/notifications", { withCredentials: true })
      .then((res) => {
        setNotifications(res.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar notificações:", err);
      });
  };

  const buscarServicos = () => {
    axios
      .get("http://localhost:8081/admin/service/api", { withCredentials: true })
      .then((res) => {
        if (!Array.isArray(res.data)) {
          console.error("Erro: resposta não é array", res.data);
          return;
        }

        const formatted = res.data.map((service) => {
          try {
            const start = new Date(`${service.visitDate}T${service.visitTime}`);
            const end = new Date(start.getTime() + 60 * 60 * 1000);

            return {
              id: service.id,
              title: `${service.serviceType} - ${service.status}`,
              start,
              end,
              status: service.status,
            };
          } catch (e) {
            console.error("Erro ao formatar serviço:", service, e);
            return null;
          }
        }).filter(Boolean);

        setServices(formatted);
      })
      .catch((error) => {
        console.error("Erro ao buscar serviços:", error);
        if (error.response) {
          console.error("Resposta do servidor:", error.response.status, error.response.data);
        }
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/user/role", { withCredentials: true })
      .then((res) => {
        setIsAdmin(res.data === "ROLE_ADMIN");
        buscarServicos();
        buscarNotificacoes();
      })
      .catch((err) => {
        console.error("Erro ao verificar papel do usuário:", err);
        buscarServicos();
        buscarNotificacoes();
      });
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const visibleDates = getVisibleDates(date, view);
      document.querySelectorAll('.rbc-day-bg').forEach((element, index) => {
        const currentDate = visibleDates[index];
        if (!currentDate) return;

        if (!isDataPermitida(currentDate)) {
          element.classList.add('bloqueado');
        } else {
          element.classList.remove('bloqueado');
        }
      });
    });

    const calendarNodes = document.querySelectorAll('.rbc-month-view, .rbc-time-view');
    calendarNodes.forEach(node => {
      observer.observe(node, { childList: true, subtree: true });
    });

    observer.takeRecords();

    return () => observer.disconnect();
  }, [date, view, services]);

  return (
    <div className="calendar-container">
      <nav className="navbar">
        <div className="navbar-title">
          <Link to="/home">SG Pequenos Reparos</Link>
        </div>
        <div className="navbar-links">
          {isAdmin && <Link to="/admin" className="admin-link">Painel ADM</Link>}
          {isAdmin && <Link to="/calendar" className="admin-link">Calendário</Link>}
          <Link to="/service">Serviços</Link>
          <Link to="/servicehistory">Histórico</Link>
          <Link to="/perfil">Perfil</Link>

          {/* Botão de Notificações */}
          <div className="notification-wrapper" style={{ position: "relative" }}>
            <button
              onClick={toggleNotifications}
              className="notification-button"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                marginLeft: "15px",
              }}
            >
              <Bell size={24} />
            </button>
            {showNotifications && (
              <div
                className="notification-box"
                style={{
                  position: "absolute",
                  top: "40px",
                  right: "0",
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  width: "250px",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                  zIndex: 1000,
                }}
              >
                <ul style={{ listStyle: "none", padding: "10px", margin: 0 }}>
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {notification.titulo}
                    </li>
                  ))}
                </ul>
                <div
                  style={{
                    padding: "10px",
                    borderTop: "1px solid #eee",
                    textAlign: "center",
                  }}
                >
                  <Link
                    to="/notifications"
                    style={{
                      textDecoration: "none",
                      color: "#2a4a7c",
                      fontWeight: "bold",
                    }}
                  >
                    Mais detalhes
                  </Link>
                </div>
              </div>
            )}
          </div>

          <button onClick={handleLogout}>Sair</button>
        </div>
      </nav>

      <div style={{ display: 'flex', maxWidth: '1200px', margin: 'auto', padding: '1rem', gap: '1rem' }}>
        <div style={{ flex: 2 }}>
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
                      {!isDataPermitida(service.start) && (
                        <span style={{ color: 'red', fontSize: '0.8rem' }}> (Data Bloqueada)</span>
                      )}
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
    </div>
  );
}

export default ServiceCalendar;
