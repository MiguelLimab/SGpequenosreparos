import { useState } from 'react';
import { updateUser } from '../services/authService';
import Input from '../components/Input';
import Button from '../components/Button';
import UserField from '../components/UserField';
import '../styles/components/EditUserModal.css';

const EditUserModal = ({ user = {}, onClose }) => {
  const [formData, setFormData] = useState({
    nome: user.nome || '',
    email: user.email || '',
    telefone: user.telefone || '',
    username: user.username || '',
    senha: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(formData);
      alert('Perfil atualizado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Falha ao atualizar perfil!');
    }
  };

  return (
    <div className="edit-user-modal-container">
      <h2 className="edit-user-modal-title">Editar Perfil</h2>
      <form onSubmit={handleSubmit} className="edit-user-modal-form">
        <Input label="Nome" name="nome" value={formData.nome} onChange={handleChange} required />
        <Input label="Email" name="email" value={formData.email} onChange={handleChange} required type="email" />
        <Input label="Telefone" name="telefone" value={formData.telefone} onChange={handleChange} required />
        <UserField label="Nome de Usuário" value={formData.username} />
        <Input label="Senha" name="senha" value={formData.senha} onChange={handleChange} required type="password" />
        <div className="edit-user-modal-buttons">
          <Button variant="salvar" type="submit">Salvar</Button>
          <Button variant="cancelar" onClick={onClose}>Cancelar</Button>
        </div>
      </form>
    </div>
  );
};

export default EditUserModal;
