import api from './api'; // sua instância Axios com baseURL já configurado

// Lista todos os serviços
const listarServicos = () => api.get('/servicos');

// Busca um serviço específico
const buscarServicoPorId = (id) => api.get(`/servicos/${id}`);

// Solicitar um novo serviço
const solicitarServico = (dados) => api.post('/servicos', dados);

// Aceitar serviço
const aceitarServico = (id, administradorId, data, horario) =>
  api.put(`/servicos/${id}/aceitar`, null, {
    params: {
      administradorId,
      data,
      horario
    }
  });

// Recusar serviço
const recusarServico = (id) => api.put(`/servicos/${id}/recusar`);

// Cancelar serviço
const cancelarServico = (id, motivo) =>
  api.put(`/servicos/${id}/cancelar`, null, {
    params: { motivo }
  });

// Concluir serviço
const concluirServico = (id) => api.put(`/servicos/${id}/concluir`);

// Atualizar serviço
const atualizarServico = (id, dados) => api.put(`/servicos/${id}`, dados);

export {
  listarServicos,
  buscarServicoPorId,
  solicitarServico,
  aceitarServico,
  recusarServico,
  cancelarServico,
  concluirServico,
  atualizarServico
};
