import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import Label from '../components/Label';
import "../styles/pages/CadastroPage.css";

const CadastroPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    username: '',
    tipo: 'CLIENTE',
    senha: ''
  });

  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendSmsCode = async () => {
    setError('');
    try {
      await axios.post('http://localhost:8080/api/notificacao/send-sms', null, {
        params: { telefone: formData.telefone }
      });
      alert('Código de verificação enviado para seu telefone.');
      setCodeSent(true);
    } catch (error) {
      setError('Erro ao enviar SMS. Verifique o número.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!codeSent) {
      sendSmsCode();
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/usuarios/cadastro', formData, {
        params: { code: verificationCode }
      });
      alert('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (err) {
      setError('Erro no cadastro. Verifique seus dados ou o código.');
    }
  };

  return (
    <div className="cadastro-page-container">
      <div className="cadastro-box-form">
        <h2 className="cadastro-box-title">Cadastro</h2>
        {error && <p className="cadastro-box-error">{error}</p>}
        <form onSubmit={handleSubmit} className="cadastro-box-form-element">
          <Input label="Nome" name="nome" value={formData.nome} onChange={handleChange} required />
          <Input label="Telefone (+55...)" name="telefone" value={formData.telefone} onChange={handleChange} required />
          <Input label="Nome de Usuário" name="username" value={formData.username} onChange={handleChange} required />
          <Input label="Senha" name="senha" value={formData.senha} onChange={handleChange} required type="password" />
          
          {codeSent && (
            <Input
              label="Código de Verificação"
              name="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
          )}

          <Button type="submit" variant="cadastrar">
            {codeSent ? 'Cadastrar' : 'Enviar Código'}
          </Button>

          <Label className="cadastro-box-login-label">Já possui Cadastro?</Label>
          <Link to="/login" className="cadastro-box-login-link">Entrar</Link>
        </form>
      </div>
    </div>
  );
};

export default CadastroPage;
