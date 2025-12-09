// frontend/src/pages/DashboardPage.jsx
import { useSistema } from "../context/SistemaContext";
import KPICards from "../components/dashboard/KPICards";
import StatusSummary from "../components/dashboard/StatusSummary";
import StartSimulationForm from "../components/forms/StartSimulationForm";
import NewRequestForm from "../components/forms/NewRequestForm";
import TaxiTable from "../components/tables/TaxiTable";
import Loader from "../components/common/Loader";
import Card from "../components/common/Card";

function DashboardPage() {
  const { systemData, loading, error, reload } = useSistema();

  // Valores seguros aunque aún no haya datos
  const metrics = systemData?.metrics || {
    total_taxis: 0,
    total_clients: 0,
    total_trips: 0,
    free_taxis: 0,
    busy_taxis: 0,
    ongoing_trips: 0,
  };

  const taxis = systemData?.taxis || [];
  const trips = systemData?.trips || [];
  const clients = systemData?.clients || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Cabecera */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: "1.3rem" }}>Dashboard</h2>
        <button
          onClick={reload}
          style={{
            padding: "0.4rem 0.8rem",
            borderRadius: "0.4rem",
            border: "none",
            background: "#198754",
            color: "white",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          Actualizar estado
        </button>
      </div>

      {/* Mensajes de carga o error */}
      {loading && (
        <div style={{ fontSize: "0.85rem" }}>
          <Loader /> Cargando datos del sistema...
        </div>
      )}
      {error && (
        <div style={{ fontSize: "0.85rem", color: "#ff6b6b" }}>
          Error al obtener datos: {error}
        </div>
      )}

      {/* KPIs principales */}
      <KPICards
        totalTaxis={metrics.total_taxis}
        totalClients={metrics.total_clients}
        totalTrips={metrics.total_trips}
        finishedTrips={trips.length}
      />

      {/* Formularios de iniciar sistema y crear solicitud */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "1rem" }}>
        <StartSimulationForm />
        <NewRequestForm />
      </div>

      {/* Estado general */}
      <Card title="Estado general del sistema">
        <StatusSummary
          freeTaxis={metrics.free_taxis}
          busyTaxis={metrics.busy_taxis}
          ongoingTrips={metrics.ongoing_trips}
        />
      </Card>

      {/* Tabla de taxis */}
      <Card title="Taxis en el sistema">
        <TaxiTable taxis={taxis} />
      </Card>
    </div>
  );
}

export default DashboardPage;
