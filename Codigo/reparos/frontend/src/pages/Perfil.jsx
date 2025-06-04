import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/Perfil.css";
import { useNavigate, Link } from "react-router-dom";
import { Bell } from "lucide-react"; // ícone de sino

const Perfil = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    novaSenha: "",
    confirmarSenha: "",
    senhaAtual: "",
  });

  const [msg, setMsg] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    buscarPerfil();
    buscarNotificacoes();
  }, []);

  const buscarPerfil = () => {
    axios
      .get("http://localhost:8081/profile/api/profile", {
        withCredentials: true,
      })
      .then((res) => {
        setForm((prev) => ({
          ...prev,
          username: res.data.username,
          email: res.data.email,
        }));
      })
      .catch((err) => {
        console.error("Erro ao buscar perfil:", err);
        setMsg("Erro ao carregar dados do perfil.");
      });

    axios
      .get("http://localhost:8081/api/user/role", { withCredentials: true })
      .then((res) => setIsAdmin(res.data === "ROLE_ADMIN"))
      .catch((err) => {
        console.error("Erro ao buscar papel do usuário:", err);
        setIsAdmin(false);
      });
  };

  const buscarNotificacoes = async () => {
    try {
      const response = await axios.get("http://localhost:8081/notifications", {
        withCredentials: true,
      });
      setNotifications(response.data);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (form.novaSenha !== form.confirmarSenha) {
      setMsg("As senhas não coincidem.");
      return;
    }

    try {
      await axios.put(
        "http://localhost:8081/profile/api/profile",
        {
          username: form.username,
          email: form.email,
          novaSenha: form.novaSenha,
          senhaAtual: form.senhaAtual,
        },
        { withCredentials: true }
      );

      setMsg("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      setMsg("Erro ao atualizar perfil.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir sua conta?")) {
      try {
        await axios.delete("http://localhost:8081/profile/api/profile", {
          withCredentials: true,
        });
        setMsg("Conta excluída.");
        navigate("/");
      } catch (err) {
        console.error("Erro ao excluir conta:", err);
        setMsg("Erro ao excluir conta.");
      }
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="perfil-container">
      <nav className="navbar">
        <div className="navbar-title">
          <Link to="/home">SG Pequenos Reparos</Link>
        </div>
        <div className="navbar-links">
          <Link to="/service">Serviços</Link>

          {/* Botão de Notificações */}
          <div
            className="notification-wrapper"
            style={{ position: "relative" }}
          >
            <button
              onClick={toggleNotifications}
              className="notification-button"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                marginLeft: "15px",
              }}
            >
              <Bell size={24} />
            </button>
            {showNotifications && (
              <div
                className="notification-box"
                style={{
                  position: "absolute",
                  top: "40px",
                  right: "0",
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  width: "300px",
                  maxHeight: "400px",
                  overflowY: "auto",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                  zIndex: 1000,
                }}
              >
                <ul style={{ listStyle: "none", padding: "10px", margin: 0 }}>
                  {notifications.length === 0 ? (
                    <li style={{ padding: "10px", color: "#2a4a7c" }}>Nenhuma notificação.</li>
                  ) : (
                    notifications.map((notification) => (
                      <li
                        key={notification.id}
                        style={{
                          padding: "8px 0",
                          borderBottom: "1px solid #eee",
                          color: "#2a4a7c", // <- AQUI
                        }}
                      >
                        <strong style={{ color: "#2a4a7c" }}>
                          {notification.titulo}
                        </strong>
                        <br />
                        <small style={{ color: "#2a4a7c" }}>
                          {notification.descricao}
                        </small>
                        <br />
                        <small style={{ color: "#888" }}>
                          {new Date(notification.data).toLocaleString("pt-BR")}
                        </small>
                      </li>
                    ))
                  )}
                </ul>
                <div
                  style={{
                    padding: "10px",
                    borderTop: "1px solid #eee",
                    textAlign: "center",
                  }}
                >
                  <Link
                    to="/notifications"
                    style={{
                      textDecoration: "none",
                      color: "#2a4a7c",
                      fontWeight: "bold",
                    }}
                  >
                    Mais detalhes
                  </Link>
                </div>
              </div>
            )}
          </div>

          <button onClick={handleLogout}>Sair</button>
        </div>
      </nav>

      <form onSubmit={handleUpdate} className="perfil-form">
        <h2>Meu Perfil</h2>

        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Novo Usuário"
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Novo Email"
        />

        <input
          type="password"
          name="novaSenha"
          value={form.novaSenha}
          onChange={handleChange}
          placeholder="Nova Senha"
        />

        <input
          type="password"
          name="confirmarSenha"
          value={form.confirmarSenha}
          onChange={handleChange}
          placeholder="Confirmar Senha"
        />

        <button type="submit">Atualizar Perfil</button>
        <button type="button" onClick={handleDelete} className="delete-btn">
          Excluir Minha Conta
        </button>

        {msg && <p className="mensagem">{msg}</p>}

        {isAdmin && <Link to="/userlist">Listar Usuários</Link>}
      </form>
    </div>
  );
};

export default Perfil;
