import api from './api'; // instância do Axios já configurada

const listarTipos = () => api.get('/tiposervico');
const criarTipo = (dados) => api.post('/tiposervico', dados);
const atualizarTipo = (id, dados) => api.put(`/tiposervico/${id}`, dados);
const deletarTipo = (id) => api.delete(`/tiposervico/${id}`);

export {
  listarTipos,
  criarTipo,
  atualizarTipo,
  deletarTipo
};
