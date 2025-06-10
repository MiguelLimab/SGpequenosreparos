import { useState, useEffect } from "react";
import { atualizarServico } from "../services/servicoService";
import { listarTipos } from "../services/tipoService";

const ModalEditarServicos = ({ servico, onClose, onAtualizado }) => {
  const [tiposServico, setTiposServico] = useState([]);
  const [formData, setFormData] = useState({
    nome: servico.nome || "",
    descricao: servico.descricao || "",
    tipoServicoId: "",
    clienteId: servico.clienteId, 
    emailContato: servico.emailContato || "",
    telefoneContato: servico.telefoneContato || "",
    diasDisponiveisCliente: servico.diasDisponiveisCliente || [],
    periodoDisponivelCliente: servico.periodoDisponivelCliente || "",
    data: servico.data ? new Date(servico.data).toISOString().split("T")[0] : "",
    horario: servico.horario ? servico.horario.slice(0, 5) : "",
    status: servico.status || "SOLICITADO",
  });

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const res = await listarTipos();
        setTiposServico(res.data);
      } catch (error) {
        console.error("Erro ao buscar tipos de serviço:", error);
      }
    };
    fetchTipos();
  }, []);

  // Preenche tipoServicoId se só o nome estiver disponível
  useEffect(() => {
    if (
      typeof servico.tipoServico === "string" &&
      formData.tipoServicoId === "" &&
      tiposServico.length > 0
    ) {
      const tipo = tiposServico.find((t) => t.nome === servico.tipoServico);
      if (tipo) {
        setFormData((prev) => ({ ...prev, tipoServicoId: tipo.id }));
      }
    }
  }, [tiposServico]);

  const diasSemana = ["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO", "DOMINGO"];
  const periodos = ["MANHA", "TARDE", "NOITE"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (dia) => {
    const dias = formData.diasDisponiveisCliente.includes(dia)
      ? formData.diasDisponiveisCliente.filter((d) => d !== dia)
      : [...formData.diasDisponiveisCliente, dia];
    setFormData({ ...formData, diasDisponiveisCliente: dias });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Payload enviado:", formData);
      await atualizarServico(servico.id, formData);
      alert("Serviço atualizado com sucesso!");
      onAtualizado();
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar serviço:", error);
      alert("Erro ao atualizar serviço.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Serviço</h2>
        <form onSubmit={handleSubmit}>
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />

          <label>Descrição:</label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            required
          />

          <label>Tipo de Serviço:</label>
          <select
            name="tipoServicoId"
            value={formData.tipoServicoId}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o tipo de serviço</option>
            {tiposServico.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nome}
              </option>
            ))}
          </select>

          <label>Dias disponíveis:</label>
          {diasSemana.map((dia) => (
            <div key={dia}>
              <label>
                <input
                  type="checkbox"
                  value={dia}
                  checked={formData.diasDisponiveisCliente.includes(dia)}
                  onChange={() => handleCheckboxChange(dia)}
                />
                {dia}
              </label>
            </div>
          ))}

          <label>Período disponível:</label>
          <select
            name="periodoDisponivelCliente"
            value={formData.periodoDisponivelCliente}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o período</option>
            {periodos.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <label>Data:</label>
          <input
            type="date"
            name="data"
            value={formData.data}
            onChange={handleChange}
          />

          <label>Horário:</label>
          <input
            type="time"
            name="horario"
            value={formData.horario}
            onChange={handleChange}
          />

          <label>Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="SOLICITADO">Solicitado</option>
            <option value="ACEITO">Aceito</option>
            <option value="CANCELADO">Cancelado</option>
            <option value="RECUSADO">Recusado</option>
            <option value="CONCLUIDO">Concluído</option>
          </select>

          <div className="modal-buttons" style={{ marginTop: "20px" }}>
            <button type="submit">Salvar</button>
            <button
              type="button"
              onClick={onClose}
              style={{ marginLeft: "10px" }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarServicos;
