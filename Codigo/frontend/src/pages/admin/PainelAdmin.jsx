import React, { useState } from 'react';
import PainelUsuarios from '../../components/admin/PainelUsuarios';
import PainelTipoServicos from '../../components/admin/PainelTipoServicos';
import PainelItinerario from '../../components/admin/PainelItinerario';
import '../../styles/pages/PainelAdmin.css';


const PainelAdmin = () => {
  const [abaAtiva, setAbaAtiva] = useState('usuarios'); // estados: usuarios, tipos, itinerario

  const renderizarConteudo = () => {
    switch (abaAtiva) {
      case 'usuarios':
        return <PainelUsuarios />;
      case 'tipos':
        return <PainelTipoServicos />;
      case 'itinerario':
        return <PainelItinerario />;
      default:
        return null;
    }
  };

  return (
    <div className="painel-admin-page">
      <aside className="painel-admin-sidebar">
        <button
          className={abaAtiva === 'usuarios' ? 'ativo' : ''}
          onClick={() => setAbaAtiva('usuarios')}
        >
          Usuários
        </button>
        <button
          className={abaAtiva === 'tipos' ? 'ativo' : ''}
          onClick={() => setAbaAtiva('tipos')}
        >
          Tipos de Serviço
        </button>
        <button
          className={abaAtiva === 'itinerario' ? 'ativo' : ''}
          onClick={() => setAbaAtiva('itinerario')}
        >
          Itinerário
        </button>
      </aside>
      <div className="painel-admin-conteudo">
        {renderizarConteudo()}
      </div>
    </div>
  );
};

export default PainelAdmin;
