import { useState, useEffect } from 'react';
import Input from '../Input';
import Button from '../Button';
import Label from '../Label';
import { listarTiposUsuarios } from '../../services/usuarioService';
import '../../styles/components/EditUserAdminModal.css'; // novo CSS

const EditUserAdminModal = ({ usuario, onSave, onClose }) => {
  const userData = usuario || {};

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
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Editar Usuário</h2>
        <form onSubmit={handleSubmit} className="form-editar-usuario">
          <Input label="Nome" name="nome" value={formData.nome} onChange={handleChange} required />
          <Input label="Email" name="email" value={formData.email} onChange={handleChange} required type="email" />
          <Input label="Telefone" name="telefone" value={formData.telefone} onChange={handleChange} required />
          <Input label="Username" name="username" value={formData.username} onChange={handleChange} required />
          <Input label="Senha" name="senha" value={formData.senha} onChange={handleChange} type="password" />

          <div className="input-container">
            <Label htmlFor="tipo" className="input-label">Tipo de Usuário:</Label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="input-field"
              required
            >
              {tipos.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div className="modal-buttons">
            <Button variant="salvar" type="submit">Salvar</Button>
            <Button variant="cancelar" type="button" onClick={onClose}>Cancelar</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserAdminModal;
