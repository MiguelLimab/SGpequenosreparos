import api from './api';

export const listarAvaliacoes = () => api.get('/avaliacoes');

export const listarAvaliacoesPorServico = (servicoId) => {
  return api.get(`/avaliacoes/servico/${servicoId}`);
};

export const enviarAvaliacao = (avaliacaoDTO) => {
  return api.post('/avaliacoes', avaliacaoDTO);
};
