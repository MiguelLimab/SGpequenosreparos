import { createContext, useState } from 'react';
import { getUserProfile } from '../services/authService';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [token] = useState('');
  const [user, setUser] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const profile = await getUserProfile(); // chama a API
      setUser(profile); // salva no state
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
    }
  };

  const login = async (username, token) => {
    setIsAuthenticated(true);
    setUsername(username);

    await fetchUserProfile(); // Assim que logar, pega o perfil
  };

const logout = async () => {
  try {
    await api.post('/auth/logout'); // Só tenta o backend
  } catch (error) {
    console.error('Erro ao fazer logout', error);
  } finally {
    logoutLocal(); // SEMPRE limpa o contexto
  }
};

const logoutLocal = () => {
  setIsAuthenticated(false);
  setUsername('');
  setUser(null);
};


  return (
    <AuthContext.Provider value={{ isAuthenticated, username, token, user, login, logout, logoutLocal }}>
      {children}
    </AuthContext.Provider>
  );
};
