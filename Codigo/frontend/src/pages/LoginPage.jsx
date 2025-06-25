import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { login as loginService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import "../styles/pages/LoginPage.css";

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
      await loginService(formData.username, formData.senha);
      login(formData.username);
      navigate("/");
    } catch (err) {
      setError("Usuário ou senha inválidos");
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-box-form">
        <h2 className="login-box-title">Login</h2>
        {error && <p className="login-box-error">{error}</p>}
        <form onSubmit={handleSubmit} className="login-box-form-element">
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
          <label className="login-box-register-label">Não possui Cadastro?</label>
          <Link to="/cadastro" className="login-box-register-link">Cadastrar</Link>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
