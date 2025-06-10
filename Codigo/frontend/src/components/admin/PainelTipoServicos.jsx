import React, { useEffect, useState } from 'react';
import { listarTipos, deletarTipo } from '../../services/tipoService';
import EditTipoModal from '../EditTipoModal';

const PainelTipoServicos = () => {
  const [tipos, setTipos] = useState([]);
  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [tipoEditando, setTipoEditando] = useState(null);

  useEffect(() => {
    carregarTipos();
  }, []);

  const carregarTipos = async () => {
    try {
      const response = await listarTipos();
      setTipos(response.data);
    } catch (error) {
      console.error('Erro ao listar tipos:', error);
    }
  };

  const handleBuscar = (e) => {
    setBusca(e.target.value);
  };

  const tiposFiltrados = tipos.filter(tipo =>
    tipo.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const abrirModal = (tipo = null) => {
    setTipoEditando(tipo);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setTipoEditando(null);
    setModalAberto(false);
    carregarTipos(); // Recarrega a lista após add/edit
  };

  const handleExcluir = async (id, nome) => {
    if (window.confirm(`Confirma exclusão do tipo "${nome}"?`)) {
      try {
        await deletarTipo(id);
        carregarTipos();
      } catch (error) {
        console.error('Erro ao excluir tipo:', error);
        alert('Não foi possível excluir o tipo.');
      }
    }
  };

  return (
    <div className="painel-tipo-servicos-container">
      <div className="painel-tipo-servicos-header">
        <h2>Gerenciamento de Tipos de Serviço</h2>
        <button className="btn-adicionar" onClick={() => abrirModal()}>Adicionar Tipo</button>
      </div>

      <div className="painel-tipo-servicos-filtro">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={busca}
          onChange={handleBuscar}
          className="input-busca"
        />
      </div>

      <table className="tabela-tipos">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Duração (min)</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {tiposFiltrados.map(tipo => (
            <tr key={tipo.id}>
              <td>{tipo.nome}</td>
              <td>{tipo.descricao || '-'}</td>
              <td>{tipo.duracao}</td>
              <td>
                <button className="btn-editar" onClick={() => abrirModal(tipo)}>Editar</button>
                <button
                  className="btn-excluir"
                  onClick={() => handleExcluir(tipo.id, tipo.nome)}
                  style={{ marginLeft: 8 }}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
          {tiposFiltrados.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>Nenhum tipo encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>

      {modalAberto && (
        <EditTipoModal tipo={tipoEditando} fecharModal={fecharModal} />
      )}
    </div>
  );
};

export default PainelTipoServicos;
