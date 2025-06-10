import { useEffect, useState } from 'react';
import { getUserProfile } from '../services/authService';

const ModalDetalhesServico = ({ servico, onClose }) => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserProfile();
        setUsuario(res);
      } catch (error) {
        console.error("Erro ao buscar perfil do usuário:", error);
      }
    };
    fetchUser();
  }, []);

  const formatarData = (data) => {
    return data ? new Date(data).toLocaleDateString('pt-BR') : 'Não agendada';
  };

  const formatarHorario = (horario) => {
    return horario ? horario.slice(0, 5) : 'Não agendado';
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Detalhes do Serviço</h2>
        <p><strong>Nome:</strong> {servico.nome}</p>
        <p><strong>Descrição:</strong> {servico.descricao}</p>
        <p><strong>Tipo:</strong> {typeof servico.tipoServico === 'string' ? servico.tipoServico : servico.tipoServico?.nome}</p>
        <p><strong>Status:</strong> {servico.status}</p>
        <p><strong>Data Agendada:</strong> {formatarData(servico.data)}</p>
        <p><strong>Horário:</strong> {formatarHorario(servico.horario)}</p>
        <p><strong>Turno disponível do cliente:</strong> {servico.periodoDisponivelCliente}</p>
        <p><strong>Dias disponíveis do cliente:</strong> {servico.diasDisponiveisCliente?.join(', ')}</p>

        {usuario?.tipo === 'CLIENTE' && (
          <p><strong>Prestador:</strong> {servico.administradorNome || 'Não definido'}</p>
        )}

        {usuario?.tipo === 'ADMIN' && (
          <p><strong>Cliente:</strong> {servico.clienteNome}</p>
        )}

        <div className="modal-buttons" style={{ marginTop: '20px' }}>
          <button onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalhesServico;
