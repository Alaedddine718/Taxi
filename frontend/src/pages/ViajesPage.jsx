import { useSistema } from "../context/SistemaContext";
import TripsTable from "../components/tables/TripsTable";
import Loader from "../components/common/Loader";

function ViajesPage() {
  const { systemData, loading, error } = useSistema();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Viajes</h2>
      {loading && <Loader />}
      {error && (
        <div style={{ fontSize: "0.8rem", color: "#f97316" }}>
          Error: {error}
        </div>
      )}
      <TripsTable trips={systemData.trips} />
    </div>
  );
}

export default ViajesPage;
