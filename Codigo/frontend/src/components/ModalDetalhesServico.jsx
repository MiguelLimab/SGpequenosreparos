import { useEffect, useState } from 'react';
import { getUserProfile } from '../services/authService';
import '../styles/components/ModalDetalhesServico.css';
import Button from './Button';

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
    <div className="modal-detalhes-overlay">
      <div className="modal-detalhes-content">
        <h2 className="modal-detalhes-titulo">Detalhes do Serviço</h2>

        <div className="modal-detalhes-info">
          <p><strong>Nome:</strong> {servico.nome}</p>
          <p><strong>Descrição:</strong> {servico.descricao}</p>
          <p><strong>Tipo:</strong> {typeof servico.tipoServico === 'string' ? servico.tipoServico : servico.tipoServico?.nome}</p>
          <p><strong>Status:</strong> {servico.status}</p>
          <p><strong>Data Agendada:</strong> {formatarData(servico.data)}</p>
          <p><strong>Horário:</strong> {formatarHorario(servico.horario)}</p>
          <p><strong>Turno do Cliente:</strong> {servico.periodoDisponivelCliente}</p>
          <p><strong>Dias Disponíveis do Cliente:</strong> {servico.diasDisponiveisCliente?.join(', ')}</p>

          {usuario?.tipo === 'CLIENTE' && (
            <p><strong>Prestador:</strong> {servico.administradorNome || 'Não definido'}</p>
          )}

          {usuario?.tipo === 'ADMIN' && (
            <p><strong>Cliente:</strong> {servico.clienteNome}</p>
          )}
        </div>

        <div className="modal-detalhes-botoes">
          <Button variant="cancelar" onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalhesServico;