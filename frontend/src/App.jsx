import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import TaxisPage from "./pages/TaxisPage";
import ClientesPage from "./pages/ClientesPage";
import ViajesPage from "./pages/ViajesPage";
import AdminPage from "./pages/AdminPage";
import { Routes, Route, Navigate } from "react-router-dom";
import { SistemaProvider } from "./context/SistemaContext";

function App() {
  return (
    <SistemaProvider>
      <DashboardLayout>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/taxis" element={<TaxisPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/viajes" element={<ViajesPage />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* ruta inicial */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          {/* cualquier ruta rara → dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </DashboardLayout>
    </SistemaProvider>
  );
}

export default App;





