import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../css/admin/UserList.css";

const UserList = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);

  useEffect(() => {
    const buscarUsuarios = async () => {
      try {
        const response = await axios.get("http://localhost:8081/admin/userlist", {
          withCredentials: true,
        });
        setUsuarios(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };
    buscarUsuarios();
  }, []);

  const handleLogout = () => {
    navigate("/");
  };

  const handleEditarClick = () => {
    setModoEdicao(true);
  };

  const handleCancelarEdicao = () => {
    setModoEdicao(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUsuarioSelecionado((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalvar = async () => {
    try {
      await axios.put(`http://localhost:8081/admin/user/${usuarioSelecionado.id}`, usuarioSelecionado, {
        withCredentials: true,
      });
      alert("Usuário atualizado com sucesso!");
      setModoEdicao(false);
      // Atualiza a lista
      setUsuarios((prev) =>
        prev.map((u) => (u.id === usuarioSelecionado.id ? usuarioSelecionado : u))
      );
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      alert("Erro ao atualizar o usuário.");
    }
  };

  const handleExcluir = async () => {
    const confirmacao = window.confirm("Tem certeza que deseja excluir este usuário?");
    if (!confirmacao) return;

    try {
      await axios.delete(`http://localhost:8081/admin/user/${usuarioSelecionado.id}`, {
        withCredentials: true,
      });
      alert("Usuário excluído com sucesso!");
      setUsuarios((prev) => prev.filter((u) => u.id !== usuarioSelecionado.id));
      setUsuarioSelecionado(null);
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      alert("Erro ao excluir o usuário.");
    }
  };

  return (
    <div className="user-list-container">
      <nav className="navbar">
        <div className="navbar-title"><Link to="/home">SG Pequenos Reparos</Link></div>
        <div className="navbar-links">
          <Link to="/service">Serviços</Link>
          <Link to="/perfil">Perfil</Link>
          <button onClick={handleLogout}>Sair</button>
        </div>
      </nav>

      <div className="main">
        <h1>Lista de Usuários</h1>
        <div className="user-table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(usuarios) && usuarios.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => { setUsuarioSelecionado(user); setModoEdicao(false); }}>Ver</button>
                    <button onClick={() => { setUsuarioSelecionado(user); setModoEdicao(true); }}>Editar</button>
                    <button onClick={() => { setUsuarioSelecionado(user); handleExcluir(); }}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {usuarioSelecionado && (
          <div className="overlay" onClick={() => setUsuarioSelecionado(null)}>
            <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
              <h2>{modoEdicao ? "Editar Usuário" : "Detalhes do Usuário"}</h2>

              {modoEdicao ? (
                <>
                  <label>ID:</label>
                  <input type="text" value={usuarioSelecionado.id} disabled />

                  <label>Username:</label>
                  <input
                    name="username"
                    value={usuarioSelecionado.username}
                    onChange={handleInputChange}
                  />

                  <label>Email:</label>
                  <input
                    name="email"
                    value={usuarioSelecionado.email}
                    onChange={handleInputChange}
                  />

                  <label>Role:</label>
                  <input
                    name="role"
                    value={usuarioSelecionado.role}
                    onChange={handleInputChange}
                  />

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                    <button onClick={handleSalvar}>Salvar</button>
                    <button onClick={handleCancelarEdicao} style={{ backgroundColor: "#aaa" }}>
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p><strong>ID:</strong> {usuarioSelecionado.id}</p>
                  <p><strong>Username:</strong> {usuarioSelecionado.username}</p>
                  <p><strong>Email:</strong> {usuarioSelecionado.email}</p>
                  <p><strong>Role:</strong> {usuarioSelecionado.role}</p>
                  <p><strong>Total de Serviços:</strong> {usuarioSelecionado.totalServices}</p>
                  <p><strong>Serviços Concluídos:</strong> {usuarioSelecionado.completedServices}</p>
                  <p><strong>Serviços Cancelados:</strong> {usuarioSelecionado.canceledServices}</p>
                  <p><strong>Outros Status:</strong> {usuarioSelecionado.otherServices}</p>
                  <button onClick={() => setUsuarioSelecionado(null)}>Fechar</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
