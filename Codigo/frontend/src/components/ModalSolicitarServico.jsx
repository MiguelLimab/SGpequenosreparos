import { useState, useEffect } from 'react';
import { listarTipos } from '../services/tipoService';
import { getUserProfile } from '../services/authService';
import { solicitarServico } from '../services/servicoService';
import Button from './Button';
import '../styles/components/ModalSolicitarServico.css';

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
      await solicitarServico({
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
      onServicoCriado();
    } catch (error) {
      console.error('Erro ao solicitar serviço:', error);
      alert('Falha ao solicitar serviço.');
    }
  };

  const diasSemana = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO'];
  const periodos = ['MANHA', 'TARDE', 'NOITE'];

  return (
    <div className="modal-solicitar-overlay">
      <div className="modal-solicitar-content">
        <h2 className="modal-solicitar-title">Solicitar Novo Serviço</h2>
        <form onSubmit={handleSubmit} className="modal-solicitar-form">
          <label>Nome do serviço:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <label>Descrição:</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />

          <label>Tipo de serviço:</label>
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

          <label>Dias disponíveis:</label>
          <div className="modal-solicitar-checkbox-group">
            {diasSemana.map(dia => (
              <label key={dia}>
                <input
                  type="checkbox"
                  value={dia}
                  checked={diasDisponiveisCliente.includes(dia)}
                  onChange={() => handleCheckboxChange(dia)}
                />
                {dia}
              </label>
            ))}
          </div>

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

          <div className="modal-solicitar-actions">
            <Button type="submit" variant="salvar">Solicitar</Button>
            <Button type="button" variant="cancelar" onClick={onClose}>Cancelar</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalSolicitarServico;
