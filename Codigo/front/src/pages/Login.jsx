import React, { useState } from 'react';
import '../css/Login.css'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit =async  (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: username,
          senha: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }
      console.log('Login realizado:', data);
    } catch (err) {
      console.log(err);
    } 

  };

  return (
    <div className="login-container">
      <div className="left-section">
        <div className="login-content">
          <div className="login-header">
            <img src="src/assets/caixa.png" alt="Logo SG Pequenos Reparos" className="logo" />
            <h1>SG Pequenos Reparos</h1>
            <p className="sistema-acesso">Acesso ao Sistema</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Usuário</label>
              <input
                type="email"
                placeholder="ex: jaea@gmail.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <i className="fas fa-user-hard-hat"></i>
            </div>

            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i className="fas fa-lock"></i>
            </div>

            <button type="submit" className="login-btn">
              <i className="fas fa-tools"></i> Entrar no Sistema
            </button>

            <a href="#" className="forgot-password">Esqueceu a senha?</a>
          </form>
        </div>
      </div>

      <div className="right-section">
        <div className="background-overlay"></div>
        <img 
          src="src/assets/gelson.png"
          alt="Imagem de fundo" 
          className="background-image" 
        />
      </div>
    </div>
  );
};

export default Login;