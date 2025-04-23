import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../../css/admin/PainelAdmin.css";

const PainelAdmin = () => {
  const [servicos, setServicos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    buscarServicos();
  }, [filtro]);

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const buscarServicos = () => {
    let url = "http://localhost:8081/admin/service/api";
    if (filtro) url += `?status=${filtro}`;

    axios
      .get(url, { withCredentials: true })
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
          <Link to="/service">Serviços</Link>
          <Link to="/perfil">Perfil</Link>
          <Link to="/admin">Painel ADM</Link>
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
              <option value="AGENDAMENTO_FINALIZACAO">
                AGENDAMENTO_FINALIZACAO
              </option>
              <option value="AGUARDANDO_FINALIZACAO">
                AGUARDANDO_FINALIZACAO
              </option>
              <option value="FINALIZADO">FINALIZADO</option>
              <option value="CANCELADO">CANCELADO</option>
              <option value="REJEITADO">REJEITADO</option>
            </select>
            <button type="button" onClick={buscarServicos}>
              Filtrar
            </button>
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
                    {servico.serviceType} -{" "}
                    {servico.user?.username || "Usuário"}
                  </h3>
                  <span
                    className={`badge status-${servico.status.toLowerCase()}`}
                  >
                    {servico.status}
                  </span>
                </header>
                <div className="details">
                  <p>
                    <strong>Local:</strong> {servico.location}
                  </p>
                  <p>
                    <strong>Data:</strong>{" "}
                    {new Date(servico.visitDate).toLocaleDateString("pt-BR")}
                  </p>
                  <p>
                    <strong>Horário:</strong> {servico.visitTime.slice(0, 5)}
                  </p>
                  <p>
                    <strong>Descrição:</strong>{" "}
                    {servico.description || "Nenhuma"}
                  </p>
                  <p>
                    <strong>Preço:</strong>{" "}
                    {servico.price != null
                      ? `R$ ${servico.price.toFixed(2)}`
                      : "-"}
                  </p>
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
                    <select
                      name="status"
                      value={form.status || ""}
                      onChange={handleFormChange}
                    >
                      <option value="">Selecione o status</option>
                      <option value="AGENDAMENTO_VISITA">
                        AGENDAMENTO_VISITA
                      </option>
                      <option value="VISITADO">VISITADO</option>
                      <option value="AGENDAMENTO_FINALIZACAO">
                        AGENDAMENTO_FINALIZACAO
                      </option>
                      <option value="AGUARDANDO_FINALIZACAO">
                        AGUARDANDO_FINALIZACAO
                      </option>
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
