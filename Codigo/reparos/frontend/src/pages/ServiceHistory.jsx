import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/ServiceHistory.css";
import { useNavigate, Link } from "react-router-dom";
import { Bell } from "lucide-react"; // Ícone de sino

const ServiceHistory = () => {
  const [servicos, setServicos] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [erro, setErro] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [showNotifications, setShowNotifications] = useState(false); // Estado notificações

  const navigate = useNavigate();

  const notifications = [
    "Histórico de serviço atualizado",
    "Novo serviço adicionado ao histórico",
    "Mensagem importante do suporte",
  ];

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/user/role", { withCredentials: true })
      .then((res) => {
        setIsAdmin(res.data === "ROLE_ADMIN");
        buscarHistoricoServicos();
      })
      .catch((err) => {
        console.error("Erro ao verificar papel do usuário:", err);
        buscarHistoricoServicos();
      });
  }, []);

  const buscarHistoricoServicos = () => {
    setErro("");
    axios
      .get("http://localhost:8081/service/api/service", { withCredentials: true })
      .then((res) => {
        const historico = res.data.filter(servico => 
          servico.status === 'CONCLUIDO' || 
          servico.status === 'CANCELADO' || 
          servico.status === 'FINALIZADO' || 
          servico.status === 'REJEITADO'
        );
        setServicos(historico);
      })
      .catch((err) => {
        console.error("Erro ao buscar histórico de serviços:", err);
        setErro("Erro ao carregar histórico de serviços. Tente novamente mais tarde.");
      });
  };

  const handleLogout = () => {
    navigate("/");
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const formatarData = (dataStr) => {
    if (!dataStr) return "";
    const data = new Date(dataStr);
    if (isNaN(data)) return dataStr;
    return data.toLocaleDateString("pt-BR");
  };

  const formatarStatus = (status) => {
    const statusMap = {
      'CONCLUIDO': 'Concluído',
      'FINALIZADO': 'Finalizado',
      'CANCELADO': 'Cancelado',
      'REJEITADO': 'Rejeitado'
    };
    return statusMap[status] || status;
  };

  const formatarTipoServico = (tipo) => {
    const tiposMap = {
      'ELETRICO': 'Elétrico',
      'ENCANAMENTO': 'Encanamento',
      'PINTURA': 'Pintura',
      'ALVENARIA': 'Alvenaria',
      'OUTROS': 'Outros'
    };
    return tiposMap[tipo] || tipo;
  };

  const servicosFiltrados = servicos.filter(servico => {
    const filtroTipoOk = !tipoFiltro || servico.serviceType === tipoFiltro;
    const filtroStatusOk = !statusFiltro || servico.status === statusFiltro;
    return filtroTipoOk && filtroStatusOk;
  });

  return (
    <div className="servicos-container">
      <nav className="navbar">
        <div className="navbar-title">
          <Link to="/home">SG Pequenos Reparos</Link>
        </div>
        <div className="navbar-links">
          {isAdmin && <Link to="/admin" className="admin-link">Painel ADM</Link>}
          {isAdmin && <Link to="/calendar" className="admin-link">Calendário</Link>}
          <Link to="/service">Serviços</Link>
          <Link to="/servicehistory">Histórico</Link>
          <Link to="/perfil">Perfil</Link>

          {/* Botão de Notificações */}
          <div className="notification-wrapper" style={{ position: "relative" }}>
            <button
              onClick={toggleNotifications}
              className="notification-button"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                marginLeft: "15px",
              }}
            >
              <Bell size={24} />
            </button>
            {showNotifications && (
              <div
                className="notification-box"
                style={{
                  position: "absolute",
                  top: "40px",
                  right: "0",
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  width: "250px",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                  zIndex: 1000,
                }}
              >
                <ul style={{ listStyle: "none", padding: "10px", margin: 0 }}>
                  {notifications.map((notification, index) => (
                    <li
                      key={index}
                      style={{
                        padding: "8px 0",
                        borderBottom: index !== notifications.length - 1 ? "1px solid #eee" : "none",
                      }}
                    >
                      {notification}
                    </li>
                  ))}
                </ul>
                <div
                  style={{
                    padding: "10px",
                    borderTop: "1px solid #eee",
                    textAlign: "center",
                  }}
                >
                  <Link
                    to="/notifications"
                    style={{
                      textDecoration: "none",
                      color: "#2a4a7c",
                      fontWeight: "bold",
                    }}
                  >
                    Mais detalhes
                  </Link>
                </div>
              </div>
            )}
          </div>

          <button onClick={handleLogout}>Sair</button>
        </div>
      </nav>

      <h1>Histórico de Serviços</h1>

      <div className="filtros-container">
        <div className="filtro-container">
          <label htmlFor="filtroTipo">Filtrar por tipo:</label>
          <select
            id="filtroTipo"
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="ELETRICO">Elétrico</option>
            <option value="ENCANAMENTO">Encanamento</option>
            <option value="PINTURA">Pintura</option>
            <option value="ALVENARIA">Alvenaria</option>
            <option value="OUTROS">Outros</option>
          </select>
        </div>

        <div className="filtro-container">
          <label htmlFor="filtroStatus">Filtrar por status:</label>
          <select
            id="filtroStatus"
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="CONCLUIDO">Concluído</option>
            <option value="FINALIZADO">Finalizado</option>
            <option value="CANCELADO">Cancelado</option>
            <option value="REJEITADO">Rejeitado</option>
          </select>
        </div>
      </div>

      {erro && <p className="erro">{erro}</p>}

      {servicosFiltrados.length === 0 ? (
        <p>Nenhum serviço encontrado no histórico.</p>
      ) : (
        servicosFiltrados.map((servico) => (
          <div key={servico.id} className="servico-card">
            <div className="servico-header">
              <h3>{formatarTipoServico(servico.serviceType)}</h3>
              <span className={`servico-status ${servico.status.toLowerCase()}`}>
                {formatarStatus(servico.status)}
              </span>
            </div>
            
            <div className="servico-content">
              <p><strong>Local:</strong> {servico.location}</p>
              <p><strong>Descrição:</strong> {servico.description || "Nenhuma"}</p>
              <p><strong>Visita realizada em:</strong> {formatarData(servico.visitDate)} às {servico.visitTime}</p>
              
              {servico.completionDate && (
                <p><strong>Finalização:</strong> {formatarData(servico.completionDate)} às {servico.completionTime}</p>
              )}
              
              {servico.price && (
                <p><strong>Valor:</strong> R$ {servico.price.toFixed(2)}</p>
              )}
              
              {servico.estimatedDuration && (
                <p><strong>Duração Estimada:</strong> {servico.estimatedDuration}</p>
              )}
              
              {servico.motivoCancelamento && (
                <div className="motivo-cancelamento">
                  <p><strong>Motivo do cancelamento:</strong> {servico.motivoCancelamento}</p>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ServiceHistory;
