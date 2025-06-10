import React, { useState, useEffect } from 'react';
import { getItinerario, saveItinerario } from '../../services/itinerarioService'; // ajuste o caminho conforme necessário

const diasDaSemana = [
  { label: 'Domingo', valor: 1 },
  { label: 'Segunda-feira', valor: 2 },
  { label: 'Terça-feira', valor: 3 },
  { label: 'Quarta-feira', valor: 4 },
  { label: 'Quinta-feira', valor: 5 },
  { label: 'Sexta-feira', valor: 6 },
  { label: 'Sábado', valor: 7 },
];

const PainelItinerario = () => {
  const [tipo, setTipo] = useState('FIXO'); // 'FIXO' ou 'CICLICO'
  const [diasSelecionados, setDiasSelecionados] = useState([]);
  const [diasTrabalho, setDiasTrabalho] = useState(4);
  const [diasFolga, setDiasFolga] = useState(4);
  const [horaInicio, setHoraInicio] = useState('08:00');
  const [horaFim, setHoraFim] = useState('17:00');
  const [observacao, setObservacao] = useState('');

  // Função para formatar hora no padrão HH:mm:ss
  const formatarHora = (hora) => `${hora}:00`;

  const toggleDia = (valor) => {
    if (diasSelecionados.includes(valor)) {
      setDiasSelecionados(diasSelecionados.filter(d => d !== valor));
    } else {
      setDiasSelecionados([...diasSelecionados, valor]);
    }
  };

  // Carrega itinerário do backend ao montar componente
  useEffect(() => {
    getItinerario()
      .then(({ data }) => {
        if (data) {
          setTipo(data.tipoItinerario);
          if (data.tipoItinerario === 'FIXO') {
            setDiasSelecionados(data.diasSemana || []);
          } else {
            setDiasTrabalho(data.diasTrabalho || 4);
            setDiasFolga(data.diasFolga || 4);
          }
          setHoraInicio(data.horaInicio ? data.horaInicio.slice(0,5) : '08:00');
          setHoraFim(data.horaFim ? data.horaFim.slice(0,5) : '17:00');
        }
      })
      .catch(() => {
        // pode exibir mensagem ou ignorar se não existir ainda
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const config = {
      tipoItinerario: tipo,
      diasSemana: tipo === 'FIXO' ? diasSelecionados : null,
      diasTrabalho: tipo === 'CICLICO' ? diasTrabalho : null,
      diasFolga: tipo === 'CICLICO' ? diasFolga : null,
      horaInicio: formatarHora(horaInicio),
      horaFim: formatarHora(horaFim),
      observacao
    };

    saveItinerario(config)
      .then(() => {
        alert('Itinerário salvo com sucesso!');
      })
      .catch((error) => {
        alert('Erro ao salvar itinerário: ' + (error.response?.data?.message || error.message));
      });
  };

  return (
    <div className="painel-itinerario-container">
      <h2>Configuração de Itinerário</h2>
      <form onSubmit={handleSubmit} className="form-itinerario">
        <div className="form-group">
          <label>Tipo de Configuração:</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="select-tipo">
            <option value="FIXO">Dias Fixos da Semana</option>
            <option value="CICLICO">Escala Cíclica (Ex: 4 dias sim / 4 dias não)</option>
          </select>
        </div>

        {tipo === 'FIXO' && (
          <div className="form-group-dias">
            <label>Selecionar Dias:</label>
            <div className="dias-checkboxes">
              {diasDaSemana.map(({ label, valor }) => (
                <label key={valor} className="checkbox-dia">
                  <input
                    type="checkbox"
                    checked={diasSelecionados.includes(valor)}
                    onChange={() => toggleDia(valor)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        )}

        {tipo === 'CICLICO' && (
          <div className="form-group-ciclo">
            <label>Dias de Trabalho:</label>
            <input
              type="number"
              value={diasTrabalho}
              onChange={(e) => setDiasTrabalho(Number(e.target.value))}
              min="1"
              className="input-ciclo"
            />
            <label>Dias de Folga:</label>
            <input
              type="number"
              value={diasFolga}
              onChange={(e) => setDiasFolga(Number(e.target.value))}
              min="1"
              className="input-ciclo"
            />
          </div>
        )}

        <div className="form-group">
          <label>Hora Início:</label>
          <input
            type="time"
            value={horaInicio}
            onChange={e => setHoraInicio(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Hora Fim:</label>
          <input
            type="time"
            value={horaFim}
            onChange={e => setHoraFim(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Observação:</label>
          <textarea
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            rows="4"
            placeholder="Adicione observações adicionais..."
            className="textarea-observacao"
          />
        </div>

        <div className="form-acoes">
          <button type="submit" className="btn-salvar">Salvar Configuração</button>
        </div>
      </form>
    </div>
  );
};

export default PainelItinerario;
