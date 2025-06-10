import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { login as loginService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", senha: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await loginService(formData.username, formData.senha); // só espera o 200
      login(formData.username); // só salva o username, sem token
      navigate("/");
    } catch (err) {
      setError("Usuário ou senha inválidos");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <Input
          label="Nome de Usuário"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <Input
          label="Senha"
          type="password"
          name="senha"
          value={formData.senha}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="entrar">Entrar</Button>
      </form>
    </div>
  );
};

export default LoginPage;
