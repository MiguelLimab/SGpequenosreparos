import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/Service.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Servicos = () => {
  const [servicos, setServicos] = useState([]);
  const [erro, setErro] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [novoServico, setNovoServico] = useState({
    serviceType: "",
    location: "",
    visitDate: "",
    visitTime: "",
    description: "",
  });

  useEffect(() => {
    buscarServicos();
  }, []);

  const buscarServicos = () => {
    axios
      .get("http://localhost:8081/service/api/service", { withCredentials: true })
      .then((res) => setServicos(res.data))
      .catch((err) => {
        console.error("Erro ao buscar serviços:", err);
        setErro("Erro ao carregar serviços.");
      });
  };

  const handleNovoChange = (e) => {
    setNovoServico({ ...novoServico, [e.target.name]: e.target.value });
  };

  const handleAdicionarServico = async (e) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append("serviceType", novoServico.serviceType);
      formData.append("location", novoServico.location);
      formData.append("visitDate", novoServico.visitDate);
      formData.append("visitTime", novoServico.visitTime);
      formData.append("description", novoServico.description);
  
      await axios.post("http://localhost:8081/service/new", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
  
      alert("Serviço adicionado com sucesso!");
      setShowForm(false);
      setNovoServico({
        serviceType: "",
        location: "",
        visitDate: "",
        visitTime: "",
        description: "",
      });
      buscarServicos(); // Atualiza a lista
    } catch (err) {
      console.error("Erro ao adicionar serviço:", err);
      setErro("Erro ao adicionar serviço.");
    }
  };

  const cancelarServico = async (id) => {
    if (window.confirm("Tem certeza que deseja cancelar este serviço?")) {
      try {
        await axios.post(`http://localhost:8081/service/cancel/${id}`, {}, { withCredentials: true });
        buscarServicos();
      } catch (err) {
        console.error("Erro ao cancelar:", err);
        setErro("Erro ao cancelar serviço.");
      }
    }
  };

  const aceitarServico = async (id) => {
    try {
      await axios.post(`http://localhost:8081/service/accept/${id}`, {}, { withCredentials: true });
      buscarServicos();
    } catch (err) {
      console.error("Erro ao aceitar:", err);
      setErro("Erro ao aceitar preço.");
    }
  };

  const rejeitarServico = async (id) => {
    try {
      await axios.post(`http://localhost:8081/service/reject/${id}`, {}, { withCredentials: true });
      buscarServicos();
    } catch (err) {
      console.error("Erro ao rejeitar:", err);
      setErro("Erro ao rejeitar preço.");
    }
  };
  const navigate = useNavigate();
  const handleLogout = () => {
    // Aqui você pode limpar dados do usuário (localStorage, token, etc.)
    navigate("/");
  };

  return (
    <div className="servicos-container">
      <nav className="navbar">
        <div className="navbar-title"><Link to="/home">SG Pequenos Reparos</Link></div>
        <div className="navbar-links">
        <Link to="/service">Servicos</Link>
          <Link to="/perfil">Perfil</Link>
          <button onClick={handleLogout}>Sair</button>
        </div>
      </nav>

      <h1>Meus Serviços</h1>

      <button className="adicionar-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Fechar Formulário" : "➕ Adicionar Serviço"}
      </button>

      {showForm && (
        <form className="form-adicionar" onSubmit={handleAdicionarServico}>
          <select name="serviceType" value={novoServico.serviceType} onChange={handleNovoChange} required>
            <option value="">Selecione o tipo</option>
            <option value="ELETRICO">Elétrico</option>
            <option value="ENCANAMENTO">Encanamento</option>
            <option value="PINTURA">Pintura</option>
            <option value="ALVENARIA">Alvenaria</option>
            <option value="OUTROS">Outros</option>
          </select>

          <input type="text" name="location" placeholder="Localização" value={novoServico.location} onChange={handleNovoChange} required />
          <input type="date" name="visitDate" value={novoServico.visitDate} onChange={handleNovoChange} required />
          <input type="time" name="visitTime" value={novoServico.visitTime} onChange={handleNovoChange} required />
          <textarea name="description" placeholder="Descrição" value={novoServico.description} onChange={handleNovoChange}></textarea>

          <button type="submit">Salvar Serviço</button>
        </form>
      )}

      {erro && <p className="erro">{erro}</p>}
      {servicos.length === 0 ? (
        <p>Nenhum serviço encontrado.</p>
      ) : (
        servicos.map((servico) => (
          <div key={servico.id} className="servico-card">
            <h3>{servico.serviceType}</h3>
            <p><strong>Local:</strong> {servico.location}</p>
            <p><strong>Status:</strong> {servico.status}</p>
            <p><strong>Descrição:</strong> {servico.description || "Nenhuma"}</p>

            {servico.status === "AGENDAMENTO_VISITA" && (
              <>
                <p><strong>Visita:</strong> {servico.visitDate} às {servico.visitTime}</p>
                <button onClick={() => cancelarServico(servico.id)}>Cancelar Serviço</button>
              </>
            )}

            {servico.status === "VISITADO" && (
              <>
                <p><strong>Preço Proposto:</strong> {servico.price ? `R$ ${servico.price.toFixed(2)}` : "Aguardando avaliação"}</p>
                {servico.price && (
                  <>
                    <button onClick={() => aceitarServico(servico.id)}>Aceitar Preço</button>
                    <button onClick={() => rejeitarServico(servico.id)}>Rejeitar Preço</button>
                  </>
                )}
              </>
            )}

            {(servico.status === "FINALIZADO" || servico.status === "AGUARDANDO_FINALIZACAO") && (
              <>
                <p><strong>Preço:</strong> R$ {servico.price.toFixed(2)}</p>
                <p><strong>Finalização:</strong> {servico.completionDate} às {servico.completionTime}</p>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Servicos;
