import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useState } from "react";
import Button from "../components/Button";
import EditUserModal from "../components/EditUserModal";
import UserField from "../components/UserField";

const Perfil = () => {
  const { user, username, logout } = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <h1>Perfil de {username}</h1>
      {user ? (
        <div className="boxDadosDoUsuario">
          <UserField label="Nome" value={user.nome} />
          <UserField label="Email" value={user.email} />
          <UserField label="Telefone" value={user.telefone} />
        </div>
      ) : (
        <p>Carregando dados do usuário...</p> // ou pode mostrar um loading spinner
      )}
      <Button variant="sair" onClick={handleLogout}>Sair</Button>
      <Button variant="editar" onClick={() => setIsModalOpen(true)}>Editar</Button>

      {isModalOpen && (
        <EditUserModal user={user} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default Perfil;
