import { useState, useEffect } from 'react';
import { atualizarServico } from '../services/servicoService';
import { listarTipos } from '../services/tipoService';
import Input from './Input';
import Button from './Button';
import Label from './Label';
import '../styles/components/ModalEditarServicos.css';

const ModalEditarServicos = ({ servico, onClose, onAtualizado }) => {
  const [tiposServico, setTiposServico] = useState([]);
  const [formData, setFormData] = useState({
    nome: servico.nome || '',
    descricao: servico.descricao || '',
    tipoServicoId: '',
    clienteId: servico.clienteId,
    emailContato: servico.emailContato || '',
    telefoneContato: servico.telefoneContato || '',
    diasDisponiveisCliente: servico.diasDisponiveisCliente || [],
    periodoDisponivelCliente: servico.periodoDisponivelCliente || '',
    data: servico.data ? new Date(servico.data).toISOString().split('T')[0] : '',
    horario: servico.horario ? servico.horario.slice(0, 5) : '',
    status: servico.status || 'SOLICITADO',
  });

  const diasSemana = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO'];
  const periodos = ['MANHA', 'TARDE', 'NOITE'];

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const res = await listarTipos();
        setTiposServico(res.data);
      } catch (error) {
        console.error("Erro ao buscar tipos de serviço:", error);
      }
    };
    fetchTipos();
  }, []);

  useEffect(() => {
    if (
      typeof servico.tipoServico === 'string' &&
      formData.tipoServicoId === '' &&
      tiposServico.length > 0
    ) {
      const tipo = tiposServico.find((t) => t.nome === servico.tipoServico);
      if (tipo) {
        setFormData((prev) => ({ ...prev, tipoServicoId: tipo.id }));
      }
    }
  }, [tiposServico]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (dia) => {
    const dias = formData.diasDisponiveisCliente.includes(dia)
      ? formData.diasDisponiveisCliente.filter((d) => d !== dia)
      : [...formData.diasDisponiveisCliente, dia];
    setFormData({ ...formData, diasDisponiveisCliente: dias });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await atualizarServico(servico.id, formData);
      alert('Serviço atualizado com sucesso!');
      onAtualizado();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      alert('Erro ao atualizar serviço.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Editar Serviço</h2>
        <form onSubmit={handleSubmit} className="form-editar-servico">
          <Input label="Nome" name="nome" value={formData.nome} onChange={handleChange} required />
          <Label htmlFor="descricao">Descrição:</Label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            className="input-field"
            required
          />

          <Label htmlFor="tipoServicoId">Tipo de Serviço:</Label>
          <select
            name="tipoServicoId"
            value={formData.tipoServicoId}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="">Selecione o tipo de serviço</option>
            {tiposServico.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
            ))}
          </select>

          <Label>Dias disponíveis do cliente:</Label>
          <div className="dias-checkboxes">
            {diasSemana.map((dia) => (
              <label key={dia} className="checkbox-item">
                <input
                  type="checkbox"
                  value={dia}
                  checked={formData.diasDisponiveisCliente.includes(dia)}
                  onChange={() => handleCheckboxChange(dia)}
                />
                {dia}
              </label>
            ))}
          </div>

          <Label htmlFor="periodoDisponivelCliente">Período disponível:</Label>
          <select
            name="periodoDisponivelCliente"
            value={formData.periodoDisponivelCliente}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="">Selecione o período</option>
            {periodos.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <Input label="Data" type="date" name="data" value={formData.data} onChange={handleChange} />
          <Input label="Horário" type="time" name="horario" value={formData.horario} onChange={handleChange} />

          <Label htmlFor="status">Status:</Label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="SOLICITADO">Solicitado</option>
            <option value="ACEITO">Aceito</option>
            <option value="CANCELADO">Cancelado</option>
            <option value="RECUSADO">Recusado</option>
            <option value="CONCLUIDO">Concluído</option>
          </select>

          <div className="modal-buttons">
            <Button variant="salvar" type="submit">Salvar</Button>
            <Button variant="cancelar" type="button" onClick={onClose}>Cancelar</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarServicos;
