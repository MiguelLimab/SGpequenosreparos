import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

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
            status: service.status, // importante para as cores
          };
        });

        setServices(formatted);
      })
      .catch(error => console.error(error));
  }, []);

  // Define as cores dos eventos de acordo com o status
  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad'; // padrão azul

    if (event.status === 'Pendente') backgroundColor = '#f0ad4e'; // amarelo
    else if (event.status === 'Concluído') backgroundColor = '#5cb85c'; // verde
    else if (event.status === 'Cancelado') backgroundColor = '#d9534f'; // vermelho

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
      }
    };
  };

  return (
    <div className="calendar-container">
      <h2>Calendário de Serviços</h2>
      <Calendar
        localizer={localizer}
        events={services}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        eventPropGetter={eventStyleGetter}
        messages={{
          next: "Próximo",
          previous: "Anterior",
          today: "Hoje",
          month: "Mês",
          week: "Semana",
          day: "Dia",
        }}
      />
    </div>
  );
}

export default ServiceCalendar;
