import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../css/admin/PainelAdmin.css";

const PainelAdmin = () => {
  const [servicos, setServicos] = useState([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    buscarServicos();
  }, [filtro]);

  const buscarServicos = () => {
    let url = "http://localhost:8081/admin/service/api";
    if (filtro) url += `?status=${filtro}`;
  
    axios.get(url, { withCredentials: true })
      .then((res) => {
        setServicos(res.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar serviços:", err);
        setServicos([]);
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
          <a href="/logout">Sair</a>
        </div>
      </nav>

      <main className="main-content">
        <h1>Gerenciamento de Serviços</h1>

        <section className="filters">
          <form>
            <label htmlFor="status">Status:</label>
            <select id="status" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
              <option value="">Todos</option>
              <option value="AGENDAMENTO_VISITA">AGENDAMENTO_VISITA</option>
              <option value="VISITADO">VISITADO</option>
              <option value="AGENDAMENTO_FINALIZACAO">AGENDAMENTO_FINALIZACAO</option>
              <option value="AGUARDANDO_FINALIZACAO">AGUARDANDO_FINALIZACAO</option>
              <option value="FINALIZADO">FINALIZADO</option>
              <option value="CANCELADO">CANCELADO</option>
              <option value="REJEITADO">REJEITADO</option>
            </select>
            <button type="button" onClick={buscarServicos}>Filtrar</button>
          </form>
        </section>

        <section className="service-list">
          {servicos.length === 0 ? (
            <p>Nenhum serviço encontrado.</p>
          ) : (
            servicos.map((servico) => (
              <div key={servico.id} className="service-card">
                <header>
                  <h3>{servico.serviceType} - {servico.username}</h3>
                  <span className={`badge status-${servico.status.toLowerCase()}`}>{servico.status}</span>
                </header>
                <div className="details">
                  <p><strong>Local:</strong> {servico.location}</p>
                  <p><strong>Descrição:</strong> {servico.description || "Nenhuma"}</p>
                </div>
                <div className="actions">
                  <p>Ações baseadas no status</p>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
};

export default PainelAdmin;