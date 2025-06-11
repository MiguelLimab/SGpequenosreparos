const CardServico = ({ servico, tipo }) => {
  const formatarData = (isoDate) => {
    const [ano, mes, dia] = isoDate.split("-");
    return new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR");
  };

  return (
    <div className="card-servico">
      <h4>{servico.nome}</h4>
      <p>Status: {servico.status}</p>
      {servico.data && (
        <p>Data agendada: {formatarData(servico.data)}</p>
      )}
      {tipo === 'agendado' && (
        <p><strong>Agendado para:</strong> {formatarData(servico.data)} às {servico.horario}</p>
      )}
    </div>
  );
};

export default CardServico;
