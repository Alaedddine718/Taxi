// frontend/src/pages/ClientesPage.jsx
import { useSistema } from "../context/SistemaContext";
import ClientsTable from "../components/tables/ClientsTable";
import Loader from "../components/common/Loader";
import Card from "../components/common/Card";

function ClientesPage() {
  const { systemData, loading, error, reload } = useSistema();
  const clients = systemData?.clients || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: "1.3rem" }}>Clientes</h2>
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
          <Loader /> Cargando clientes...
        </div>
      )}
      {error && (
        <div style={{ fontSize: "0.85rem", color: "#ff6b6b" }}>
          Error: {error}
        </div>
      )}

      <Card title="Lista de clientes">
        <ClientsTable clients={clients} />
      </Card>
    </div>
  );
}

export default ClientesPage;

