import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);

      await axios.post("http://localhost:8081/login", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        withCredentials: true,
      });

      navigate("/home");
    } catch (err) {
      setErrorMsg("Usuário ou senha inválidos.");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>

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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        <button type="submit">Entrar</button>

        <button
          type="button"
          onClick={() => navigate("/register")}
          style={{ marginTop: "1rem", backgroundColor: "#2a4a7c" }}
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export default Login;
