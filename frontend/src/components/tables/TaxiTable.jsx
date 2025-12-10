// frontend/src/components/tables/TaxiTable.jsx
import { useSistema } from "../../context/SistemaContext";

function TaxiTable() {
  const { systemData, loading, error } = useSistema();

  // Si aún no hay datos, usamos una lista vacía
  const taxis = systemData && Array.isArray(systemData.taxis)
    ? systemData.taxis
    : [];

  if (loading) {
    return (
      <p style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
        Cargando taxis...
      </p>
    );
  }

  if (error) {
    return (
      <p style={{ fontSize: "0.9rem", color: "#fecaca" }}>
        Error al cargar taxis: {error}
      </p>
    );
  }

  if (!taxis.length) {
    return (
      <p style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
        No hay taxis registrados todavía.
      </p>
    );
  }

  return (
    <div style={{ marginTop: "1rem" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.9rem",
          color: "#e5e7eb",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "rgba(15,23,42,0.9)",
            }}
          >
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Estado</th>
            <th style={thStyle}>Viajes realizados</th>
            <th style={thStyle}>Total facturado (€)</th>
          </tr>
        </thead>
        <tbody>
          {taxis.map((taxi, index) => {
            const id =
              taxi.id ??
              taxi.taxi_id ??
              taxi.codigo ??
              `Taxi ${index + 1}`;

            const estado =
              taxi.status ??
              taxi.estado ??
              (taxi.ocupado ? "ocupado" : "libre");

            const viajesRealizados =
              taxi.trips_completed ??
              taxi.viajes_realizados ??
              (Array.isArray(taxi.trips) ? taxi.trips.length : 0);

            // Nos aseguramos de que siempre sea un número
            const totalIngresosRaw =
              taxi.total_fare ??
              taxi.totalFare ??
              taxi.ingresos ??
              0;

            const totalIngresos = Number(totalIngresosRaw || 0).toFixed(2);

            return (
              <tr
                key={id}
                style={{
                  backgroundColor:
                    index % 2 === 0
                      ? "rgba(15,23,42,0.8)"
                      : "rgba(15,23,42,0.6)",
                }}
              >
                <td style={tdStyle}>{id}</td>
                <td style={tdStyle}>{estado}</td>
                <td style={tdStyle}>{viajesRealizados}</td>
                <td style={tdStyle}>{totalIngresos}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Estilos reutilizables
const thStyle = {
  textAlign: "left",
  padding: "0.5rem 0.75rem",
  borderBottom: "1px solid rgba(55,65,81,0.7)",
  fontWeight: 600,
  fontSize: "0.85rem",
};

const tdStyle = {
  padding: "0.45rem 0.75rem",
  borderBottom: "1px solid rgba(31,41,55,0.7)",
};

export default TaxiTable;


