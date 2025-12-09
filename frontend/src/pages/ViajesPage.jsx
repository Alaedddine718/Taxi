// frontend/src/pages/ViajesPage.jsx
import { useSistema } from "../context/SistemaContext";
import TripsTable from "../components/tables/TripsTable";
import Loader from "../components/common/Loader";
import Card from "../components/common/Card";

function ViajesPage() {
  const { systemData, loading, error, reload } = useSistema();
  const trips = systemData?.trips || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: "1.3rem" }}>Viajes</h2>
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
          Actualizar
        </button>
      </div>

      {loading && (
        <div style={{ fontSize: "0.85rem" }}>
          <Loader /> Cargando viajes...
        </div>
      )}
      {error && (
        <div style={{ fontSize: "0.85rem", color: "#ff6b6b" }}>
          Error: {error}
        </div>
      )}

      <Card title="Histórico de viajes">
        <TripsTable trips={trips} />
      </Card>
    </div>
  );
}

export default ViajesPage;

