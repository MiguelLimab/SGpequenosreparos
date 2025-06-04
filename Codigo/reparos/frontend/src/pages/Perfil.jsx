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
    newPassword: "",
    confirmPassword: "",
    currentPassword: "",
  });
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(""); // "error", "info", etc.
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const fetchProfileData = async () => {
    try {
      const res = await axios.get("http://localhost:8081/profile/api/profile", {
        withCredentials: true,
      });
      setUsuario(res.data);
      setForm({
        username: res.data.username,
        email: res.data.email,
        newPassword: "",
        confirmPassword: "",
        currentPassword: ""
      });
      setMsg("");
      setMsgType("");
    } catch (err) {
      console.error("Erro ao buscar perfil:", err);
      setMsg("Erro ao carregar dados do perfil.");
      setMsgType("error");
    }
  };

  useEffect(() => {
    fetchProfileData();
    axios.get("http://localhost:8081/api/user/role", { withCredentials: true })
      .then(res => setIsAdmin(res.data === "ROLE_ADMIN"))
      .catch(err => {
        console.error("Erro ao buscar papel do usuário:", err);
        setIsAdmin(false);
      });
  }, []);

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
    const { name, value } = e.target;

    setForm(prev => {
      const updatedForm = { ...prev, [name]: value };

      if (name === "newPassword" || name === "confirmPassword") {
        if (updatedForm.newPassword && updatedForm.confirmPassword) {
          if (updatedForm.newPassword !== updatedForm.confirmPassword) {
            setPasswordError("As senhas não coincidem");
          } else {
            setPasswordError("");
          }
        } else {
          setPasswordError("");
        }
      }

      return updatedForm;
    });
  };

  const validateForm = () => {
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setPasswordError("As senhas não coincidem");
      return false;
    }
    return true;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Verifica se as informações são iguais às atuais (sem considerar currentPassword)
    const isUsernameUnchanged = form.username === usuario.username;
    const isEmailUnchanged = form.email === usuario.email;
    const isPasswordEmpty = !form.newPassword;

    if (isUsernameUnchanged && isEmailUnchanged && isPasswordEmpty) {
      setMsg("Nenhuma alteração detectada. Por favor, modifique alguma informação para atualizar.");
      setMsgType("info");
      return;
    }

    try {
      const payload = {
        username: form.username,
        email: form.email,
        currentPassword: form.currentPassword,
      };

      if (form.newPassword) {
        payload.newPassword = form.newPassword;
        payload.confirmPassword = form.confirmPassword;
      }

      await axios.put(
        "http://localhost:8081/profile/api/profile",
        payload,
        { withCredentials: true }
      );

      alert("Perfil atualizado com sucesso! Faça login novamente.");
      await axios.post("http://localhost:8081/logout", {}, { withCredentials: true });
      navigate("/");
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);

      if (!err.response) {
        setMsg("Não foi possível conectar ao servidor. Verifique sua conexão.");
      } else if (err.response.status === 400) {
        setMsg(err.response.data || "Dados inválidos. Verifique o formulário.");
      } else if (err.response.status === 401) {
        setMsg("Senha atual incorreta. Por favor, tente novamente.");
      } else if (err.response.status === 409) {
        setMsg("Nome de usuário ou email já está em uso.");
      } else {
        setMsg("Erro inesperado ao atualizar perfil. Tente novamente mais tarde.");
      }

      setMsgType("error");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir sua conta?")) {
      try {
        await axios.delete("http://localhost:8081/profile/api/profile", {
          withCredentials: true,
        });
        navigate("/");
      } catch (err) {
        console.error("Erro ao excluir conta:", err);
        setMsg(err.response?.data || "Erro ao excluir conta.");
        setMsgType("error");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8081/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    } finally {
      navigate("/");
    }
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
                    <li style={{ padding: "10px", color: "#2a4a7c" }}>
                      Nenhuma notificação.
                    </li>
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
          required
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Novo Email"
          required
        />

        <input
          type="password"
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          placeholder="Nova Senha (deixe em branco para manter a atual)"
        />

        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirmar Nova Senha"
        />

        {passwordError && <p className="error-message">{passwordError}</p>}

        <input
          type="password"
          name="currentPassword"
          value={form.currentPassword}
          onChange={handleChange}
          placeholder="Senha Atual (obrigatória para alterações)"
          required
        />

        <button type="submit">Atualizar Perfil</button>
        <button type="button" onClick={handleDelete} className="delete-btn">
          Excluir Minha Conta
        </button>

        {msg && (
          <p className={msgType === "error" ? "error-message" : "info-message"}>
            {msg}
          </p>
        )}

        {isAdmin && <Link to="/userlist">Listar Usuários</Link>}
      </form>
    </div>
  );
};

export default Perfil;
