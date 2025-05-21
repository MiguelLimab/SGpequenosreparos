import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../../css/admin/PainelAdmin.css";

const PainelAdmin = () => {
  const [servicos, setServicos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    buscarServicos();
  }, [filtro]);

  const handleLogout = () => {
    navigate("/");
  };

  const buscarServicos = () => {
    let url = "http://localhost:8081/admin/service/api";
    const params = new URLSearchParams();

    if (filtro) params.append("status", filtro);

    axios
      .get(fullUrl, { withCredentials: true })
      .then((res) => setServicos(res.data))
      .catch((err) => {
        console.error("Erro ao buscar serviços:", err);
        setServicos([]);
      });
  };

  const handleEditar = (servico) => {
    setEditando(servico.id);
    setForm({ ...servico });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value || "" });
  };

  const salvarEdicao = () => {
    const formFiltrado = { ...form };
    delete formFiltrado.user;

    axios
      .put(
        `http://localhost:8081/admin/service/edit/${editando}`,
        formFiltrado,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        alert("Serviço atualizado com sucesso!");
        setEditando(null);
        buscarServicos();
      })
      .catch((err) => {
        console.error("Erro ao atualizar serviço:", err);
        alert("Erro ao atualizar serviço.");
      });
  };

  return (
    <div className="admin-container">
      <nav className="navbar">
        <div className="navbar-title">
          <Link to="/home">SG Pequenos Reparos</Link>
        </div>
        <div className="navbar-links">
          <Link to="/admin">Painel ADM</Link>
          <Link to="/calendar">Calendario</Link>
          <Link to="/service">Serviços</Link>
          <Link to="/perfil">Perfil</Link>
          <button onClick={handleLogout}>Sair</button>
        </div>
      </nav>

      <main className="main-content">
        <h1>Gerenciamento de Serviços</h1>

        <section className="filters">
          <form>
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="AGENDAMENTO_VISITA">AGENDAMENTO_VISITA</option>
              <option value="VISITADO">VISITADO</option>
              <option value="AGENDAMENTO_FINALIZACAO">AGENDAMENTO_FINALIZACAO</option>
              <option value="AGUARDANDO_FINALIZACAO">AGUARDANDO_FINALIZACAO</option>
              <option value="FINALIZADO">FINALIZADO</option>
              <option value="CANCELADO">CANCELADO</option>
              <option value="REJEITADO">REJEITADO</option>
              <button type="button" onClick={buscarServicos}></button>
            </select>
          </form>
        </section>

        <section className="service-list">
          {servicos.length === 0 ? (
            <p>Nenhum serviço encontrado.</p>
          ) : (
            servicos.map((servico) => (
              <div key={servico.id} className="service-card">
                <header>
                  <h3>
                    {servico.serviceType} - {servico.user?.username || "Usuário"}
                  </h3>
                  <span className={`badge status-${servico.status.toLowerCase()}`}>
                    {servico.status}
                  </span>
                </header>
                <div className="details">
                  <p><strong>Local:</strong> {servico.location}</p>
                  <p><strong>Data:</strong> {new Date(servico.visitDate).toLocaleDateString("pt-BR")}</p>
                  <p><strong>Horário:</strong> {servico.visitTime?.slice(0, 5)}</p>
                  <p><strong>Descrição:</strong> {servico.description || "Nenhuma"}</p>
                  <p><strong>Preço:</strong> {servico.price != null ? `R$ ${servico.price.toFixed(2)}` : "-"}</p>
                  <p><strong>Duração estimada:</strong> {servico.estimatedDuration || "Nenhuma"}</p>
                  <p><strong>Status Orçamento:</strong> {servico.orcamentoStatus || "Nenhuma"}</p>
                </div>
                <div className="actions">
                  <button onClick={() => handleEditar(servico)}>Editar</button>
                </div>
                {editando === servico.id && (
                  <div className="edit-form">
                    <input
                      name="location"
                      value={form.location || ""}
                      onChange={handleFormChange}
                      placeholder="Localização"
                    />
                    <input
                      name="description"
                      value={form.description || ""}
                      onChange={handleFormChange}
                      placeholder="Descrição"
                    />
                    <input
                      name="visitDate"
                      type="date"
                      value={form.visitDate || ""}
                      onChange={handleFormChange}
                    />
                    <input
                      name="visitTime"
                      type="time"
                      value={form.visitTime || ""}
                      onChange={handleFormChange}
                    />
                    <input
                      name="completionDate"
                      type="date"
                      value={form.completionDate || ""}
                      onChange={handleFormChange}
                    />
                    <input
                      name="completionTime"
                      type="time"
                      value={form.completionTime || ""}
                      onChange={handleFormChange}
                    />
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      value={form.price || ""}
                      onChange={handleFormChange}
                      placeholder="Preço"
                    />
                    <input
                      type="text"
                      name="estimatedDuration"
                      placeholder="Duração estimada"
                      value={form.estimatedDuration || ""}
                      onChange={handleFormChange}
                    />
                    <div>
                      <label>Situação Orçamento:</label>
                      <select
                        name="orcamentoStatus"
                        value={form.orcamentoStatus || "A_FAZER"}
                        onChange={handleFormChange}
                      >
                        <option value="A_FAZER">A FAZER</option>
                        <option value="FEITO">FEITO</option>
                      </select>
                    </div>

                    <select
                      name="status"
                      value={form.status || ""}
                      onChange={handleFormChange}
                    >
                      <option value="">Selecione o status</option>
                      <option value="AGENDAMENTO_VISITA">AGENDAMENTO_VISITA</option>
                      <option value="VISITADO">VISITADO</option>
                      <option value="AGENDAMENTO_FINALIZACAO">AGENDAMENTO_FINALIZACAO</option>
                      <option value="AGUARDANDO_FINALIZACAO">AGUARDANDO_FINALIZACAO</option>
                      <option value="FINALIZADO">FINALIZADO</option>
                      <option value="CANCELADO">CANCELADO</option>
                      <option value="REJEITADO">REJEITADO</option>
                    </select>
                    <button onClick={salvarEdicao}>Salvar Alterações</button>
                  </div>
                )}
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
};

export default PainelAdmin;
