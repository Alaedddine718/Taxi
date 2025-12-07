import { useSistema } from "../context/SistemaContext";
import KPICards from "../components/dashboard/KPICards";
import StatusSummary from "../components/dashboard/StatusSummary";
import StartSimulationForm from "../components/forms/StartSimulationForm";
import NewRequestForm from "../components/forms/NewRequestForm";
import TaxiTable from "../components/tables/TaxiTable";
import TripsTable from "../components/tables/TripsTable";
import Loader from "../components/common/Loader";

function DashboardPage() {
  // Cogemos TODO el estado del contexto
  const sistema = useSistema();

  // Si por algún motivo aún es undefined, ponemos valores por defecto
  const systemData = sistema?.systemData ?? {
    taxis: [],
    clients: [],
    trips: [],
  };
  const loading = sistema?.loading ?? false;
  const error = sistema?.error ?? "";

  const taxis = systemData?.taxis ?? [];
  const clients = systemData?.clients ?? [];
  const trips = systemData?.trips ?? [];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      {error && (
        <div style={{ fontSize: "0.8rem", color: "#f97316" }}>
          Backend no disponible o error al obtener datos.
        </div>
      )}

      {loading && (
        <div style={{ marginBottom: "0.5rem" }}>
          <Loader />
        </div>
      )}

      {/* KPIs */}
      <KPICards systemData={systemData} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
          gap: "0.75rem",
        }}
      >
        {/* Columna izquierda: formularios */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          <StartSimulationForm />
          <StatusSummary systemData={systemData} />
        </div>

        {/* Columna derecha: nueva solicitud */}
        <div>
          <NewRequestForm />
        </div>
      </div>

      {/* Tablas de taxis y viajes */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr)",
          gap: "0.75rem",
        }}
      >
        <TaxiTable taxis={taxis} />
        <TripsTable trips={trips} />
      </div>
    </div>
  );
}

export default DashboardPage;
