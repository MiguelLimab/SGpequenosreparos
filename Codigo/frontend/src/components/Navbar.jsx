import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { listarNotificacoesRecentes } from "../services/notificacaoService";
import ModalNotificacoes from "./ModalNotificacoes";
import "../styles/components/Navbar.css";


const Navbar = () => {
  const { isAuthenticated, username, user } = useContext(AuthContext);
  const [notificacoesRecentes, setNotificacoesRecentes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const fetchNotificacoes = async () => {
      if (user?.id) {
        try {
          const res = await listarNotificacoesRecentes(user.id);
          setNotificacoesRecentes(res.data);
        } catch (err) {
          console.error("Erro ao buscar notificações:", err);
        }
      }
    };

    fetchNotificacoes();
  }, [user?.id]);

  const temNotificacoes = notificacoesRecentes.length > 0;

  return (
    <nav className="navbar-container">
      <Link to="/" className="navbar-logo">
        SG Pequenos Reparos
      </Link>

      {!isAuthenticated ? (
        <div className="navbar-links">
          <Link to="/cadastro" className="navbar-link">Cadastro</Link>
          <Link to="/login" className="navbar-link">Login</Link>
        </div>
      ) : (
        <div className="navbar-links">
          {user?.tipo === "ADMIN" && (
            <>
              <Link to="/admin/painel" className="navbar-link">Painel</Link>
              <Link to="/admin/servicos" className="navbar-link">Serviços</Link>
            </>
          )}

          {user?.tipo === "CLIENTE" && (
            <Link to="/cliente/servicos" className="navbar-link">Serviços</Link>
          )}

          <button
            onClick={() => setMostrarModal(true)}
            className="navbar-notification-btn"
            title="Notificações"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="navbar-notification-icon"
              viewBox="0 0 24 24"
            >
              <path d="M12 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 006 14h12a1 1 0 00.707-1.707L18 11.586V8a6 6 0 00-6-6zm0 20a2 2 0 001.995-1.85L14 20h-4a2 2 0 001.85 1.995L12 22z" />
            </svg>
            {temNotificacoes && (
              <span className="navbar-notification-alert">!</span>
            )}
          </button>

          <Link to="/perfil" className="navbar-link">Olá, {username}!</Link>
        </div>
      )}

      {mostrarModal && (
        <ModalNotificacoes
          notificacoes={notificacoesRecentes}
          onClose={() => setMostrarModal(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
