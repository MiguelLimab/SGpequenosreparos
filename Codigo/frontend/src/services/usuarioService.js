import api from './api'; // sua instância do Axios

const listarUsuarios = () => api.get('/usuarios');
const listarTiposUsuarios = () => api.get('/usuarios/tipos');
const criarUsuario = (dados) => api.post('/usuarios', dados);
const atualizarUsuario = (id, dados) => api.put(`/usuarios/${id}`, dados);
const deletarUsuario = (id) => api.delete(`/usuarios/${id}`);

export {
  listarUsuarios,
  listarTiposUsuarios,
  criarUsuario,
  atualizarUsuario,
  deletarUsuario
};
