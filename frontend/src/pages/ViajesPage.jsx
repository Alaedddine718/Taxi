// frontend/src/pages/ViajesPage.jsx
import { useSistema } from "../context/SistemaContext";

function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isNaN(n) ? fallback : n;
}

export default function ViajesPage() {
  const { systemData, loading, error } = useSistema();

  // 💡 OJO: el backend manda "trips", no "viajes"
  const trips = systemData?.trips || [];

  if (loading && !systemData) {
    return <p style={{ padding: "1rem" }}>Cargando viajes…</p>;
  }

  if (error) {
    return (
      <p style={{ padding: "1rem", color: "#f97373" }}>
        Error al cargar viajes: {error}
      </p>
    );
  }

  if (!trips.length) {
    return (
      <p style={{ padding: "1rem" }}>
        Todavía no se ha registrado ningún viaje. Crea solicitudes desde el Dashboard.
      </p>
    );
  }

  return (
    <div style={{ padding: "0.5rem" }}>
      <h2 style={{ marginBottom: "0.75rem" }}>Histórico de viajes</h2>
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
            <th style={thStyle}>Cliente</th>
            <th style={thStyle}>Taxi</th>
            <th style={thStyle}>Origen</th>
            <th style={thStyle}>Destino</th>
            <th style={thStyle}>Distancia</th>
            <th style={thStyle}>Tarifa (€)</th>
            <th style={thStyle}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((v, index) => {
            const id = v.id || `Viaje ${index + 1}`;
            const cliente = v.client_name || v.cliente || "Cliente";
            const taxi = v.taxi_id || v.taxi || "Taxi";
            const origen = `(${v.origin_x ?? v.origen_x ?? "?"}, ${
              v.origin_y ?? v.origen_y ?? "?"
            })`;
            const destino = `(${v.dest_x ?? v.destino_x ?? "?"}, ${
              v.dest_y ?? v.destino_y ?? "?"
            })`;
            const dist = num(v.distance ?? v.distancia, 0).toFixed(2);
            const fare = num(v.fare ?? v.tarifa ?? v.price, 0).toFixed(2);
            const estado =
              v.finished || v.estado === "finalizado"
                ? "finalizado"
                : "en curso";

            return (
              <tr key={id}>
                <td style={tdStyle}>{id}</td>
                <td style={tdStyle}>{cliente}</td>
                <td style={tdStyle}>{taxi}</td>
                <td style={tdStyle}>{origen}</td>
                <td style={tdStyle}>{destino}</td>
                <td style={tdStyle}>{dist}</td>
                <td style={tdStyle}>{fare}</td>
                <td style={tdStyle}>{estado}</td>
              </tr>
            );
          })}
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



