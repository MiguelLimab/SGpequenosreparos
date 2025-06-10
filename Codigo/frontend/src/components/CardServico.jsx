const CardServico = ({ servico, tipo, onCancelar, cancelando }) => {
  const handleAvaliar = () => {
    alert('Função de avaliação em breve!');
  };

  return (
    <div className="card-servico">
      <h4>{servico.nome}</h4>
      <p>Status: {servico.status}</p>
      {servico.data && (
        <p>Data agendada: {new Date(servico.data).toLocaleDateString()}</p>
      )}
      {tipo === 'solicitado' && (
        <button 
          onClick={onCancelar} 
          disabled={cancelando}
          className="cancelar-btn"
        >
          {cancelando ? 'Cancelando...' : 'Cancelar'}
        </button>
      )}
      {tipo === 'agendado' && (
        <p><strong>Agendado para:</strong> {new Date(servico.data).toLocaleDateString()} às {servico.horario}</p>
      )}
      {tipo === 'concluido' && (
        <button 
          onClick={handleAvaliar}
          className="avaliar-btn"
        >
          Avaliar
        </button>
      )}
    </div>
  );
};

export default CardServico;
