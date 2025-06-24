import { useState, useEffect } from 'react';
import Input from '../Input';
import Button from '../Button';
import Label from '../Label';
import { listarTiposUsuarios } from '../../services/usuarioService';
import '../../styles/components/EditUserAdminModal.css';

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
        <h2 className="modal-title">Informações do Usuário</h2>
        <div className="form-editar-usuario">
          <div className="input-container">
            <Label className="input-label">Nome</Label>
            <p>{formData.nome}</p>
          </div>

          <div className="input-container">
            <Label className="input-label">Email</Label>
            <p>{formData.email}</p>
          </div>

          <div className="input-container">
            <Label className="input-label">Telefone</Label>
            <p>{formData.telefone}</p>
          </div>

          <div className="input-container">
            <Label className="input-label">Username</Label>
            <p>{formData.username}</p>
          </div>

          <div className="input-container">
            <Label className="input-label">Senha</Label>
            <p>********</p>
          </div>

          <div className="input-container">
            <Label className="input-label">Tipo de Usuário</Label>
            <p>{formData.tipo}</p>
          </div>

          <div className="modal-buttons">
            <Button variant="cancelar" type="button" onClick={onClose}>Fechar</Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EditUserAdminModal;
