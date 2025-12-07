import { useSistema } from "../context/SistemaContext";
import ClientsTable from "../components/tables/ClientsTable";
import Loader from "../components/common/Loader";

function ClientesPage() {
  const { systemData, loading, error } = useSistema();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Clientes</h2>

      {loading && <Loader />}

      {error && (
        <div style={{ fontSize: "0.8rem", color: "#f97316" }}>
          Error: {error}
        </div>
      )}

      <ClientsTable clients={systemData.clients} />
    </div>
  );
}

export default ClientesPage;

