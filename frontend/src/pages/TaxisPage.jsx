import { useSistema } from "../context/SistemaContext";
import TaxiTable from "../components/tables/TaxiTable";
import Loader from "../components/common/Loader";

function TaxisPage() {
  const { systemData, loading, error } = useSistema();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Taxis</h2>
      {loading && <Loader />}
      {error && (
        <div style={{ fontSize: "0.8rem", color: "#f97316" }}>
          Error: {error}
        </div>
      )}
      <TaxiTable taxis={systemData.taxis} />
    </div>
  );
}

export default TaxisPage;
