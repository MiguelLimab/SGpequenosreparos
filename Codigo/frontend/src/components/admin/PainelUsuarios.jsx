import React, { useEffect, useState } from "react";
import {
  listarUsuarios,
  deletarUsuario,
  atualizarUsuario,
  criarUsuario,
} from "../../services/usuarioService";
import EditUserAdminModal from "./EditUserAdminModal";
import Button from "../Button";
import '../../styles/components/PainelUsuarios.css';


const PainelUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const response = await listarUsuarios();
      setUsuarios(response.data);
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
    }
  };

  const handleBuscar = (e) => {
    setBusca(e.target.value);
  };

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const abrirModal = (usuario = null) => {
    setUsuarioEditando(usuario);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setUsuarioEditando(null);
    setModalAberto(false);
    carregarUsuarios();
  };

  const handleDeletar = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await deletarUsuario(id);
        carregarUsuarios();
      } catch (error) {
        console.error("Erro ao deletar usuário:", error);
      }
    }
  };

  const handleSalvar = async (formData) => {
    try {
      if (usuarioEditando && usuarioEditando.id) {
        // Atualiza usuário existente
        await atualizarUsuario(usuarioEditando.id, formData);
        alert("Usuário atualizado com sucesso!");
      } else {
        // Adiciona novo usuário
        await criarUsuario(formData);
        alert("Usuário adicionado com sucesso!");
      }
      fecharModal();
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      alert("Erro ao salvar usuário.");
    }
  };

  return (
    <div className="painel-usuarios-container">
      <div className="painel-usuarios-header">
        <h2>Gerenciamento de Usuários</h2>
        <Button variant="default" onClick={() => abrirModal()}>
          Adicionar Usuário
        </Button>
      </div>

      <div className="painel-usuarios-filtro">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={busca}
          onChange={handleBuscar}
          className="input-busca"
        />
      </div>

      <table className="tabela-usuarios">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Tipo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.nome}</td>
              <td>{usuario.email}</td>
              <td>{usuario.telefone}</td>
              <td>{usuario.tipo}</td>
              <td>
                <Button variant="editar" onClick={() => abrirModal(usuario)}>
                  Editar
                </Button>
                <Button
                  variant="excluir"
                  onClick={() => handleDeletar(usuario.id)}
                >
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalAberto && (
        <EditUserAdminModal
          usuario={usuarioEditando}
          onSave={handleSalvar}
          onClose={fecharModal}
        />
      )}
    </div>
  );
};

export default PainelUsuarios;
