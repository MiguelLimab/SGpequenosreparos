import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const forceLogout = async () => {
    try {
      await axios.post("http://localhost:8081/logout", {}, {
        withCredentials: true,
      });
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    await forceLogout();

    try {
      const loginResponse = await axios.post(
        "http://localhost:8081/login",
        new URLSearchParams({ username, password }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          withCredentials: true,
        }
      );

      const roleResponse = await axios.get("http://localhost:8081/api/user/role", {
        withCredentials: true,
      });

      if (roleResponse.data === "ROLE_ADMIN" || roleResponse.data === "ROLE_USER") {
        navigate("/home");
      } else {
        throw new Error("Role inválido");
      }
    } catch (err) {
      console.error("Erro de login:", err);
      setErrorMsg("Credenciais inválidas");
      await forceLogout(); 
    } finally {
      setIsLoading(false);
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

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Processando..." : "Entrar"}
        </button>

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