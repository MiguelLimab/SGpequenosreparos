import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import CadastroPage from "./pages/CadastroPage";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Perfil from "./pages/Perfil";
import PainelAdmin from "./pages/admin/PainelAdmin";
import ServicosPage from "./pages/ServicosPage";
import HistoricoServicosPage from "./pages/HistoricoServicosPage";
import ServicoAdminPage from "./pages/admin/ServicoAdminPage";
import NotificacoesPage from "./pages/NotificacoesPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/perfil"
            element={
              <PrivateRoute>
                <Perfil />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/painel"
            element={
              <PrivateRoute>
                <PainelAdmin />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/servicos"
            element={
              <PrivateRoute>
                <ServicoAdminPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/cliente/servicos"
            element={
              <PrivateRoute>
                <ServicosPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/cliente/historico"
            element={
              <PrivateRoute>
                <HistoricoServicosPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/notificacoes"
            element={
              <PrivateRoute>
                <NotificacoesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="*"
            element={
              <div style={{ padding: "20px" }}>
                <h2>Página não encontrada</h2>
                <p>Desculpe, a página que você está procurando não existe.</p>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
