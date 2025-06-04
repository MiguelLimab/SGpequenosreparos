import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/Perfil.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Perfil = () => {
  const [usuario, setUsuario] = useState({
    username: "",
    email: "",
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
    currentPassword: "",
  });
  const [msg, setMsg] = useState("");
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
    } catch (err) {
      console.error("Erro ao buscar perfil:", err);
      setMsg("Erro ao carregar dados do perfil.");
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
      setMsg(err.response?.data || "Erro ao atualizar perfil.");
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

  return (
    <div className="perfil-container">
      <nav className="navbar">
        <div className="navbar-title">
          <Link to="/home">SG Pequenos Reparos</Link>
        </div>
        <div className="navbar-links">
          <Link to="/service">Serviços</Link>
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

        {msg && <p className="mensagem">{msg}</p>}

        {isAdmin && <Link to="/userlist">Listar Usuários</Link>}
      </form>
    </div>
  );
};

export default Perfil;
