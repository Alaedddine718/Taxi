// frontend/src/pages/TaxisPage.jsx
import { useSistema } from "../context/SistemaContext";
import TaxiTable from "../components/tables/TaxiTable";
import Loader from "../components/common/Loader";
import Card from "../components/common/Card";

function TaxisPage() {
  const { systemData, loading, error, reload } = useSistema();
  const taxis = systemData?.taxis || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: "1.3rem" }}>Taxis</h2>
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
          <Loader /> Cargando taxis...
        </div>
      )}
      {error && (
        <div style={{ fontSize: "0.85rem", color: "#ff6b6b" }}>
          Error: {error}
        </div>
      )}

      <Card title="Lista de taxis">
        <TaxiTable taxis={taxis} />
      </Card>
    </div>
  );
}

export default TaxisPage;

