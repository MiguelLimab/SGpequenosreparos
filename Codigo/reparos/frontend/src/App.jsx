import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Perfil from "./pages/Perfil";
import Servicos from "./pages/Service";
import PainelAdmin from "./pages/admin/PainelAdmin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/service" element={<Servicos />} />
        <Route path="/admin" element={<PainelAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
