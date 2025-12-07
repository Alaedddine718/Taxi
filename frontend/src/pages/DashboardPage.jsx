import { useSistema } from "../context/SistemaContext";
import KPICards from "../components/dashboard/KPICards";
import StatusSummary from "../components/dashboard/StatusSummary";
import StartSimulationForm from "../components/forms/StartSimulationForm";
import NewRequestForm from "../components/forms/NewRequestForm";
import TaxiTable from "../components/tables/TaxiTable";
import TripsTable from "../components/tables/TripsTable";
import Loader from "../components/common/Loader";


function DashboardPage() {
  const { systemData, loading, error } = useSistema();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
      {loading && <Loader />}
      {error && (
        <div style={{ fontSize: "0.8rem", color: "#f97316" }}>
          Error: {error}
        </div>
      )}

      <KPICards systemData={systemData} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1.1fr)",
          gap: "0.75rem",
        }}
      >
        <StartSimulationForm />
        <NewRequestForm />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1.1fr)",
          gap: "0.75rem",
        }}
      >
        <StatusSummary systemData={systemData} />
        <TaxiTable taxis={systemData.taxis} />
      </div>

      <TripsTable trips={systemData.trips} />
    </div>
  );
}

export default DashboardPage;
