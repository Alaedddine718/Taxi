// frontend/src/pages/ClientesPage.jsx
import { useSistema } from "../context/SistemaContext";

export default function ClientesPage() {
  const { systemData, loading, error } = useSistema();

  if (loading) return <p style={{ padding: "1rem" }}>Cargando clientes…</p>;
  if (error) return <p style={{ padding: "1rem", color: "#f97373" }}>Error: {error}</p>;

  const clientes = systemData?.clientes ?? [];

  if (!clientes.length) {
    return <p style={{ padding: "1rem" }}>No hay clientes registrados todavía.</p>;
  }

  return (
    <div style={{ padding: "0.5rem" }}>
      <h2 style={{ marginBottom: "0.5rem" }}>Clientes en el sistema</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.9rem",
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Viajes realizados</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.nombre}</td>
              <td>{c.viajes_realizados ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


