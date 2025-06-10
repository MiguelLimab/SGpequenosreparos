import { useState, useEffect } from 'react';
import Input from '../Input';
import Button from '../Button';
import { listarTiposUsuarios } from '../../services/usuarioService';

const EditUserAdminModal = ({ usuario, onSave, onClose }) => {
  const userData = usuario || {}; // 👈 Aqui a proteção

  const [formData, setFormData] = useState({
    nome: userData.nome || '',
    email: userData.email || '',
    telefone: userData.telefone || '',
    username: userData.username || '',
    senha: '',
    tipo: userData.tipo || 'CLIENTE',
  });

  const [tipos, setTipos] = useState([]);

  useEffect(() => {
    async function fetchTipos() {
      try {
        const response = await listarTiposUsuarios();
        setTipos(response.data);
      } catch (error) {
        console.error('Erro ao carregar tipos de usuário:', error);
      }
    }
    fetchTipos();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div style={{
      position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      backgroundColor: 'white', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.3)', zIndex: 1000
    }}>
      <h2>Editar Usuário</h2>
      <form onSubmit={handleSubmit}>
        <Input label="Nome" name="nome" value={formData.nome} onChange={handleChange} required />
        <Input label="Email" name="email" value={formData.email} onChange={handleChange} required type="email" />
        <Input label="Telefone" name="telefone" value={formData.telefone} onChange={handleChange} required />
        <Input label="Username" name="username" value={formData.username} onChange={handleChange} required />
        <Input label="Senha" name="senha" value={formData.senha} onChange={handleChange} type="password" />

        <div className="form-group">
          <label>Tipo de Usuário</label>
          <select name="tipo" value={formData.tipo} onChange={handleChange} required>
            {tipos.map((tipo) => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        <Button variant="salvar" type="submit">Salvar</Button>
        <Button variant="cancelar" type="button" onClick={onClose}>Cancelar</Button>
      </form>
    </div>
  );
};

export default EditUserAdminModal;
