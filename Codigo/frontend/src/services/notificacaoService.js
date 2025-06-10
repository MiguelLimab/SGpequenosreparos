import api from './api'; // já inclui o token via interceptor


export const listarNotificacoesRecentes = (usuarioId) => {
  return api.get(`/notificacoes/usuario/${usuarioId}/recentes`);
};

export const listarTodasNotificacoes = (usuarioId) => {
  return api.get(`/notificacoes/usuario/${usuarioId}`);
};
