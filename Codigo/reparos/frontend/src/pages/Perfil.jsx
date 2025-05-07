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

  const [form, setForm] = useState({
    username: "",
    email: "",
    novaSenha: "",
    confirmarSenha: "",
    senhaAtual: "",
  });

  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  // Carrega os dados do usuário ao iniciar
  useEffect(() => {
    axios
      .get("http://localhost:8081/profile/api/profile", {
        withCredentials: true,
      })
      .then((res) => {
        setUsuario(res.data);
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
  }, []);

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
    // Aqui você pode limpar dados do usuário (localStorage, token, etc.)
    navigate("/");
  };

  return (
    <div className="perfil-container">
      <nav className="navbar">
        <div className="navbar-title"><Link to="/home">SG Pequenos Reparos</Link></div>
        <div className="navbar-links">
        <Link to="/service">Servicos</Link>
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
        <Link to="/userlist">Listar Usuários</Link>
      </form>
    </div>
  );
};

export default Perfil;
