import api from './api';

export const enviarAvaliacao = (avaliacaoDTO) => {
  return api.post('/avaliacoes', avaliacaoDTO);
};
