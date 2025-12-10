// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SistemaProvider } from "./context/SistemaContext";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import TaxisPage from "./pages/TaxisPage";
import ClientesPage from "./pages/ClientesPage";
import ViajesPage from "./pages/ViajesPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <BrowserRouter>
      <SistemaProvider>
        <DashboardLayout>
          <Routes>
            {/* al entrar en / te envío al dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/taxis" element={<TaxisPage />} />
            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/viajes" element={<ViajesPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </DashboardLayout>
      </SistemaProvider>
    </BrowserRouter>
  );
}

export default App;







