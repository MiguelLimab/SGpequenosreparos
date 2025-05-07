import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../css/admin/UserList.css";

const UserList = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  const handleLogout = () => {
    navigate("/");
  };

  useEffect(() => {
    const buscarUsuarios = async () => {
      try {
        const response = await axios.get("http://localhost:8081/admin/userlist", {
          withCredentials: true
        });
        console.log("Resposta:", response.data);
        setUsuarios(response.data); // Atualizando o estado com os dados retornados
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    buscarUsuarios();
  }, []);

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
              </tr>
            </thead>
            <tbody>
              {Array.isArray(usuarios) && usuarios.map((user) => (
                <tr key={user.id} onClick={() => setUsuarioSelecionado(user)}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {usuarioSelecionado && (
          <div className="overlay" onClick={() => setUsuarioSelecionado(null)}>
            <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
              <h2>Detalhes do Usuário</h2>
              <p><strong>ID:</strong> {usuarioSelecionado.id}</p>
              <p><strong>Username:</strong> {usuarioSelecionado.username}</p>
              <p><strong>Email:</strong> {usuarioSelecionado.email}</p>
              <p><strong>Role:</strong> {usuarioSelecionado.role}</p>
              <p><strong>Total de Serviços:</strong> {usuarioSelecionado.totalServices}</p>
              <p><strong>Serviços Concluídos:</strong> {usuarioSelecionado.completedServices}</p>
              <p><strong>Serviços Cancelados:</strong> {usuarioSelecionado.canceledServices}</p>
              <p><strong>Outros Status:</strong> {usuarioSelecionado.otherServices}</p>
              <button onClick={() => setUsuarioSelecionado(null)}>Fechar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
