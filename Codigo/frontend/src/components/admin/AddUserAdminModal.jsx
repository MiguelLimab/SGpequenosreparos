import React, { useState, useEffect } from "react";
import Input from "../Input";
import Button from "../Button";
import Label from "../Label";
import { listarTiposUsuarios } from "../../services/usuarioService";
import '../../styles/components/EditUserAdminModal.css';

function AddUserAdminModal({ onSave, onClose }) {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    username: "",
    senha: "",
    tipo: "CLIENTE",
  });
  const [tipos, setTipos] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await listarTiposUsuarios();
        setTipos(data);
      } catch (err) {
        console.error("Erro ao carregar tipos de usuário:", err);
      }
    })();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Adicionar Usuário</h2>
        <form onSubmit={handleSubmit} className="form-adicionar-usuario">
          <Input label="Nome" name="nome" value={formData.nome} onChange={handleChange} required />
          <Input label="Email" name="email" value={formData.email} onChange={handleChange} required type="email" />
          <Input label="Telefone" name="telefone" value={formData.telefone} onChange={handleChange} required />
          <Input label="Username" name="username" value={formData.username} onChange={handleChange} required />
          <Input label="Senha" name="senha" value={formData.senha} onChange={handleChange} required type="password" />

          <div className="input-container">
            <Label htmlFor="tipo" className="input-label">Tipo de Usuário:</Label>
            <select id="tipo" name="tipo" value={formData.tipo} onChange={handleChange} className="input-field" required>
              {tipos.map((t) => (<option key={t} value={t}>{t}</option>))}
            </select>
          </div>

          <div className="modal-buttons">
            <Button variant="cancelar" type="button" onClick={onClose}>Cancelar</Button>
            <Button variant="salvar" type="submit">Salvar</Button>
            
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUserAdminModal;
