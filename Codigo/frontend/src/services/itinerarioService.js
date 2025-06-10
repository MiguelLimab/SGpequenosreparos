import api from './api'; // sua instância axios configurada com baseURL

// Obtém o itinerário do usuário logado
const getItinerario = () => api.get('/itinerarios/meu-itinerario');

// Salva ou atualiza o itinerário do usuário logado
const saveItinerario = (dados) => api.post('/itinerarios', dados);

export {
  getItinerario,
  saveItinerario
};
