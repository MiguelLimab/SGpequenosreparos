const CardServico = ({ servico, tipo }) => {

  return (
    <div className="card-servico">
      <h4>{servico.nome}</h4>
      <p>Status: {servico.status}</p>
      {servico.data && (
        <p>Data agendada: {new Date(servico.data).toLocaleDateString()}</p>
      )}
      {tipo === 'agendado' && (
        <p><strong>Agendado para:</strong> {new Date(servico.data).toLocaleDateString()} às {servico.horario}</p>
      )}
    </div>
  );
};

export default CardServico;
