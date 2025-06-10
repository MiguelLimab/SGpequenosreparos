import React, { useState, useEffect } from 'react';
import { criarTipo, atualizarTipo } from '../services/tipoService';

const EditTipoModal = ({ tipo, fecharModal }) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [duracao, setDuracao] = useState(1);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (tipo) {
      setNome(tipo.nome || '');
      setDescricao(tipo.descricao || '');
      setDuracao(tipo.duracao || 1);
    } else {
      setNome('');
      setDescricao('');
      setDuracao(1);
    }
    setErro('');
  }, [tipo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!nome.trim()) {
      setErro('O nome é obrigatório.');
      return;
    }

    if (!duracao || duracao < 1) {
      setErro('A duração deve ser no mínimo 1 minuto.');
      return;
    }

    const dados = {
      nome: nome.trim(),
      descricao: descricao.trim(),
      duracao: Number(duracao),
    };

    try {
      if (tipo) {
        await atualizarTipo(tipo.id, dados);
      } else {
        await criarTipo(dados);
      }
      fecharModal();
    } catch (error) {
      console.error('Erro ao salvar tipo de serviço:', error);
      setErro(error.response?.data?.message || 'Erro ao salvar tipo de serviço.');
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      backgroundColor: 'white', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.3)', zIndex: 1000
    }}>
      <div className="modal-conteudo">
        <h2>{tipo ? 'Editar Tipo de Serviço' : 'Adicionar Tipo de Serviço'}</h2>
        {erro && <div className="erro">{erro}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome *</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
            />
          </div>
          <div className="form-group">
            <label>Duração (minutos) *</label>
            <input
              type="number"
              min="1"
              value={duracao}
              onChange={(e) => setDuracao(e.target.value)}
              required
            />
          </div>
          <div className="modal-acoes">
            <button type="submit" className="btn-salvar">Salvar</button>
            <button type="button" className="btn-cancelar" onClick={fecharModal}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTipoModal;
