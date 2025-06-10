import { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';

const CadastroPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    username: '',
    tipo: 'CLIENTE',
    senha: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await register(formData);
      alert('Cadastro realizado com sucesso!');
      navigate('/login'); // redireciona para login após cadastro
    } catch (err) {
      setError('Erro no cadastro. Verifique seus dados e tente novamente.');
    }
  };

  return (
    <div>
      <h2>Cadastro</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <Input label="Nome" name="nome" value={formData.nome} onChange={handleChange} required />
        <Input label="Email" name="email" value={formData.email} onChange={handleChange} required type="email" />
        <Input label="Telefone" name="telefone" value={formData.telefone} onChange={handleChange} required />
        <Input label="Nome de Usuário" name="username" value={formData.username} onChange={handleChange} required />
        <Input label="Senha" name="senha" value={formData.senha} onChange={handleChange} required type="password" />
        <Button type="submit" variant="cadastrar">Cadastrar</Button>
      </form>
    </div>
  );
};

export default CadastroPage;
