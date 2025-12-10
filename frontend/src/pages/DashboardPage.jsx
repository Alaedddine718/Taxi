import React from "react";
import { useSistema } from "../context/SistemaContext";
import KPICards from "../components/dashboard/KPICards";
import StatusSummary from "../components/dashboard/StatusSummary";
import StartSimulationForm from "../components/forms/StartSimulationForm";
import NewRequestForm from "../components/forms/NewRequestForm";
import TaxiTable from "../components/tables/TaxiTable";
import TripsTable from "../components/tables/TripsTable";
import Loader from "../components/common/Loader";

function DashboardPage() {
  const { systemData, loading, error, refreshStatus } = useSistema();

  const taxis = systemData?.taxis || [];
  const clients = systemData?.clients || [];
  const trips = systemData?.trips || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {error && (
        <div style={{ color: "#ff6b6b", fontSize: "0.9rem" }}>
          Error: {error}
        </div>
      )}

      <KPICards taxis={taxis} clients={clients} trips={trips} />
      <StatusSummary taxis={taxis} clients={clients} trips={trips} />

      {/* Formularios */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1.2fr",
          gap: "1.5rem",
        }}
      >
        <StartSimulationForm onSuccess={refreshStatus} />
        <NewRequestForm onSuccess={refreshStatus} />
      </div>

      {/* Tablas */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1.2fr",
          gap: "1.5rem",
        }}
      >
        <TaxiTable taxis={taxis} />
        <TripsTable trips={trips} />
      </div>

      {loading && <Loader />}
    </div>
  );
}

export default DashboardPage;


