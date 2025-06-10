import { useContext, useEffect, useState} from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { listarNotificacoesRecentes } from "../services/notificacaoService";
import ModalNotificacoes from "./ModalNotificacoes";

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
  return (
    <nav className="navbar">
      <Link to="/">SG Pequenos Reparos</Link>

      {!isAuthenticated ? (
        <>
          <Link to="/cadastro">Cadastro</Link>
          <Link to="/login">Login</Link>
        </>
      ) : (
        <>
          {user?.tipo === "ADMIN" && (
            <>
              <Link to="/admin/painel">Painel</Link>
              <Link to="/admin/servicos">Serviços</Link>
                        <button
            onClick={() => setMostrarModal(true)}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            Notificações
          </button>
            </>
          )}
          {user?.tipo === "CLIENTE" && (
            <>
            <Link to="/cliente/servicos">Serviços</Link>
                      <button
            onClick={() => setMostrarModal(true)}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            Notificações
          </button>
            </>
          )}
          <Link to="/perfil">Olá, {username}!</Link>
        </>
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
