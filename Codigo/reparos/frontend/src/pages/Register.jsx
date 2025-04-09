import React, { useState } from "react";
import axios from "axios";
import "../css/Login.css";

const Register = () => {
  const [nome, setNome] = useState("");
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/register", {
        nome,
        username,
        senha,
      });

      setMsg("Cadastro realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      setMsg("Erro ao cadastrar.");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Cadastro</h2>

        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Nome de usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button type="submit">Cadastrar</button>

        <button
          type="button"
          onClick={() => (window.location.href = "/")}
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
