import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../css/admin/UserList.css";

const UserList = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const buscarUsuarios = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8081/admin/userlist", {
          withCredentials: true,
        });
        setUsuarios(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        setError("Erro ao carregar usuários");
      } finally {
        setLoading(false);
      }
    };
    buscarUsuarios();
  }, []);

  const handleLogout = () => {
    navigate("/");
  };

  const handleEditarClick = () => {
    setModoEdicao(true);
    setError(null);
  };

  const handleCancelarEdicao = () => {
    setModoEdicao(false);
    setUsuarioSelecionado(null);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUsuarioSelecionado((prev) => ({ ...prev, [name]: value }));
  };

  const formatarErro = (erroOriginal) => {
    if (!erroOriginal) return "Erro desconhecido";

    const mensagem = erroOriginal.response?.data?.message || erroOriginal.message || String(erroOriginal);

    if (mensagem.includes('violação de restrição de unicidade')) {
      return "Nome de usuário já existe. Escolha outro.";
    }

    if (mensagem.includes('could not execute statement')) {
      return "Erro ao executar a operação. Verifique os dados informados: possivelmente dados duplicados ou inválidos.";
    }

    return `Erro: ${mensagem}`;
  };

  const handleSalvar = async () => {
    if (!usuarioSelecionado.username || !usuarioSelecionado.email) {
      setError("Username e email são obrigatórios!");
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        `http://localhost:8081/admin/userlist/${usuarioSelecionado.id}`,
        usuarioSelecionado,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      alert("Usuário atualizado com sucesso!");
      setModoEdicao(false);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === usuarioSelecionado.id ? usuarioSelecionado : u))
      );
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      setError(formatarErro(error));
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (user) => {
    const confirmacao = window.confirm(`Tem certeza que deseja excluir o usuário ${user.username}?`);
    if (!confirmacao) return;

    try {
      setLoading(true);
      const response = await axios.delete(
        `http://localhost:8081/admin/userlist/${user.id}`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        alert("Usuário excluído com sucesso!");
        setUsuarios(prev => prev.filter(u => u.id !== user.id));
        if (usuarioSelecionado && usuarioSelecionado.id === user.id) {
          setUsuarioSelecionado(null);
        }
      }
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      setError(formatarErro(error));
    } finally {
      setLoading(false);
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

        {loading && <div className="loading-indicator">Processando...</div>}

        {error && (
          <div className="error-message">
            <strong>⚠️ Atenção:</strong> {error}
          </div>
        )}

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
                    <button onClick={() => setUsuarioSelecionado(user)}>Ver</button>
                    {user.role !== "ROLE_ADMIN" && (
                      <>
                        <button onClick={() => { setUsuarioSelecionado(user); handleEditarClick(); }}>Editar</button>
                        <button onClick={() => handleExcluir(user)}>Excluir</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {usuarioSelecionado && (
          <div className="overlay" onClick={() => { setUsuarioSelecionado(null); setError(null); }}>
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

                  <div className="button-group">
                    <button onClick={handleSalvar} disabled={loading}>
                      {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button onClick={handleCancelarEdicao} className="cancel-button">
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
