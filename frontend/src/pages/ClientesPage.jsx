// frontend/src/pages/ClientesPage.jsx
import { useSistema } from "../context/SistemaContext";

export default function ClientesPage() {
  const { systemData, loading, error } = useSistema();

  // 💡 OJO: el backend manda "clients", no "clientes"
  const clients = systemData?.clients || [];
  const trips = systemData?.trips || [];

  if (loading && !systemData) {
    return <p style={{ padding: "1rem" }}>Cargando clientes…</p>;
  }

  if (error) {
    return (
      <p style={{ padding: "1rem", color: "#f97373" }}>
        Error al cargar clientes: {error}
      </p>
    );
  }

  if (!clients.length) {
    return (
      <p style={{ padding: "1rem" }}>
        No hay clientes registrados todavía. Crea una solicitud en el Dashboard.
      </p>
    );
  }

  // calculamos cuántos viajes ha hecho cada cliente, usando trips
  const viajesPorCliente = new Map();
  trips.forEach((trip) => {
    const name = trip.client_name || trip.cliente || "Desconocido";
    viajesPorCliente.set(name, (viajesPorCliente.get(name) || 0) + 1);
  });

  return (
    <div style={{ padding: "0.5rem" }}>
      <h2 style={{ marginBottom: "0.75rem" }}>Clientes registrados</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.9rem",
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Viajes realizados</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.id}>
              <td style={tdStyle}>{c.id}</td>
              <td style={tdStyle}>{c.name}</td>
              <td style={tdStyle}>
                {viajesPorCliente.get(c.name) || 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "0.4rem 0.6rem",
  borderBottom: "1px solid rgba(55,65,81,0.7)",
};

const tdStyle = {
  padding: "0.35rem 0.6rem",
  borderBottom: "1px solid rgba(31,41,55,0.7)",
};



