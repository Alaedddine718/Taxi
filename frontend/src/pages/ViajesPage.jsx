// frontend/src/pages/ViajesPage.jsx
import { useSistema } from "../context/SistemaContext";

export default function ViajesPage() {
  const { systemData, loading, error } = useSistema();

  if (loading) return <p style={{ padding: "1rem" }}>Cargando viajes…</p>;
  if (error) return <p style={{ padding: "1rem", color: "#f97373" }}>Error: {error}</p>;

  const viajes = systemData?.viajes ?? [];

  if (!viajes.length) {
    return <p style={{ padding: "1rem" }}>Todavía no se ha registrado ningún viaje.</p>;
  }

  return (
    <div style={{ padding: "0.5rem" }}>
      <h2 style={{ marginBottom: "0.5rem" }}>Histórico de viajes</h2>
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
            <th>Cliente</th>
            <th>Taxi</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {viajes.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.cliente_id}</td>
              <td>{v.taxi_id}</td>
              <td>
                ({v.origen_x}, {v.origen_y})
              </td>
              <td>
                ({v.destino_x}, {v.destino_y})
              </td>
              <td>{v.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


