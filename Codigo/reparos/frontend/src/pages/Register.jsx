import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Login.css"; // Reutiliza o estilo da tela de login

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      setMsg("As senhas não coincidem.");
      return;
    }

    try {
      await axios.post("http://localhost:8081/auth/register", {
        username,
        email,
        password: senha,
        confirmPassword: confirmarSenha,
      });

      setMsg("Cadastro realizado com sucesso!");
      setUsername("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");

      // Redireciona para o login após sucesso
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error("Erro ao cadastrar:", error);

      if (error.response && error.response.status === 400) {
        const mensagemErro = error.response.data;

        if (mensagemErro.includes("usuário")) {
          setMsg("Nome de usuário já está em uso.");
        } else if (mensagemErro.includes("Email")) {
          setMsg("E-mail já está cadastrado.");
        } else {
          setMsg(mensagemErro);
        }
      } else {
        setMsg("Erro ao cadastrar. Tente novamente.");
      }
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Cadastro</h2>

        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmar Senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          required
        />

        <button type="submit">Registrar</button>

        <button
          type="button"
          onClick={() => navigate("/")}
          style={{
            marginTop: "1rem",
            backgroundColor: "#2a4a7c",
            color: "#fff",
          }}
        >
          Voltar para o Login
        </button>

        {msg && <p className="error-msg">{msg}</p>}
      </form>
    </div>
  );
};

export default Register;
