import { useState, useEffect } from 'react';
import { listarTipos } from '../services/tipoService';
import { getUserProfile } from '../services/authService';
import { solicitarServico } from '../services/servicoService'; // 🆕 Importa o service

const ModalSolicitarServico = ({ onClose, onServicoCriado }) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipoServicoId, setTipoServicoId] = useState('');
  const [diasDisponiveisCliente, setDiasDisponiveisCliente] = useState([]);
  const [periodoDisponivelCliente, setPeriodoDisponivelCliente] = useState('');
  const [tiposServico, setTiposServico] = useState([]);
  const [cliente, setCliente] = useState(null);

  useEffect(() => {
    fetchTiposServico();
    fetchClienteLogado();
  }, []);

  const fetchTiposServico = async () => {
    try {
      const response = await listarTipos();
      setTiposServico(response.data);
    } catch (error) {
      console.error('Erro ao buscar tipos de serviço:', error);
    }
  };

  const fetchClienteLogado = async () => {
    try {
      const clienteData = await getUserProfile();
      setCliente(clienteData);
    } catch (error) {
      console.error('Erro ao buscar perfil do cliente:', error);
    }
  };

  const handleCheckboxChange = (dia) => {
    if (diasDisponiveisCliente.includes(dia)) {
      setDiasDisponiveisCliente(diasDisponiveisCliente.filter(d => d !== dia));
    } else {
      setDiasDisponiveisCliente([...diasDisponiveisCliente, dia]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await solicitarServico({ // 🆕 Usando o service agora
        nome,
        descricao,
        tipoServicoId,
        clienteId: cliente.id,
        emailContato: cliente.email,
        telefoneContato: cliente.telefone,
        diasDisponiveisCliente,
        periodoDisponivelCliente
      });
      alert('Serviço solicitado com sucesso!');
      onServicoCriado(); // Atualiza a lista
    } catch (error) {
      console.error('Erro ao solicitar serviço:', error);
    }
  };

  const diasSemana = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO'];
  const periodos = ['MANHA', 'TARDE', 'NOITE'];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Solicitar Novo Serviço</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome do serviço"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <textarea
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
          <select
            value={tipoServicoId}
            onChange={(e) => setTipoServicoId(e.target.value)}
            required
          >
            <option value="">Selecione o tipo de serviço</option>
            {tiposServico.map(tipo => (
              <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
            ))}
          </select>

          <div>
            <label>Dias disponíveis:</label>
            {diasSemana.map(dia => (
              <div key={dia}>
                <label>
                  <input
                    type="checkbox"
                    value={dia}
                    checked={diasDisponiveisCliente.includes(dia)}
                    onChange={() => handleCheckboxChange(dia)}
                  />
                  {dia}
                </label>
              </div>
            ))}
          </div>

          <div>
            <label>Período disponível:</label>
            <select
              value={periodoDisponivelCliente}
              onChange={(e) => setPeriodoDisponivelCliente(e.target.value)}
              required
            >
              <option value="">Selecione o período</option>
              {periodos.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: '20px' }}>
            <button type="submit">Solicitar</button>
            <button type="button" onClick={onClose} style={{ marginLeft: '10px' }}>
              Cancelar
            </button>
          </div>
        </form>
      </div>

      <style jsx="true">{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 8px;
          width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }
        form input, form textarea, form select {
          width: 100%;
          margin-top: 10px;
          padding: 8px;
        }
        form label {
          display: block;
          margin-top: 15px;
        }
      `}</style>
    </div>
  );
};

export default ModalSolicitarServico;
