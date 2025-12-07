import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardPage from "../pages/DashboardPage";
import TaxisPage from "../pages/TaxisPage";
import ClientesPage from "../pages/ClientesPage";
import ViajesPage from "../pages/ViajesPage";
import AdminPage from "../pages/AdminPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/taxis" element={<TaxisPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/viajes" element={<ViajesPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default AppRouter;
