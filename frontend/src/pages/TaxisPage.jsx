// frontend/src/pages/TaxisPage.jsx
import { useSistema } from "../context/SistemaContext";

export default function TaxisPage() {
  const { systemData, loading, error } = useSistema();

  if (loading) return <p style={{ padding: "1rem" }}>Cargando taxis…</p>;
  if (error) return <p style={{ padding: "1rem", color: "#f97373" }}>Error: {error}</p>;

  const taxis = systemData?.taxis ?? [];

  if (!taxis.length) {
    return <p style={{ padding: "1rem" }}>No hay taxis registrados todavía.</p>;
  }

  return (
    <div style={{ padding: "0.5rem" }}>
      <h2 style={{ marginBottom: "0.5rem" }}>Taxis en el sistema</h2>
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
            <th>Posición (x, y)</th>
            <th>Estado</th>
            <th>Viajes realizados</th>
          </tr>
        </thead>
        <tbody>
          {taxis.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>
                ({t.x}, {t.y})
              </td>
              <td>{t.estado}</td>
              <td>{t.viajes_realizados ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


