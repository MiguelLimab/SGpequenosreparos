import api from './api';

export const login = async (username, senha) => {
  const response = await api.post('/auth/login', {
    username: username,
    senha: senha,
  });
  return response;
};

export const getUserProfile = async () => {
  const response = await api.get('/usuarios/perfil');
  return response.data;
};

export const updateUser = async (userData) => {
  const response = await api.put('/usuarios/perfil', userData);
  return response.data;
}

export const register = async (userData) => {
  const response = await api.post('/usuarios/cadastro', userData);
  return response.data;
};
