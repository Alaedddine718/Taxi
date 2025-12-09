// frontend/src/components/tables/TripsTable.jsx

function TripsTable({ trips }) {
  if (!trips || trips.length === 0) {
    return <div style={{ fontSize: "0.85rem" }}>No hay viajes registrados todavía.</div>;
  }

  return (
    <table style={{ width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ textAlign: "left", borderBottom: "1px solid #333" }}>
          <th style={{ padding: "0.4rem" }}>ID</th>
          <th style={{ padding: "0.4rem" }}>Cliente</th>
          <th style={{ padding: "0.4rem" }}>Taxi</th>
          <th style={{ padding: "0.4rem" }}>Origen</th>
          <th style={{ padding: "0.4rem" }}>Destino</th>
          <th style={{ padding: "0.4rem" }}>Distancia</th>
          <th style={{ padding: "0.4rem" }}>Tarifa (€)</th>
        </tr>
      </thead>
      <tbody>
        {trips.map((t) => (
          <tr key={t.id} style={{ borderBottom: "1px solid #222" }}>
            <td style={{ padding: "0.4rem" }}>{t.id}</td>
            <td style={{ padding: "0.4rem" }}>{t.client_id}</td>
            <td style={{ padding: "0.4rem" }}>{t.taxi_id}</td>
            <td style={{ padding: "0.4rem" }}>
              ({t.origin_x}, {t.origin_y})
            </td>
            <td style={{ padding: "0.4rem" }}>
              ({t.dest_x}, {t.dest_y})
            </td>
            <td style={{ padding: "0.4rem" }}>{t.distance.toFixed(2)}</td>
            <td style={{ padding: "0.4rem" }}>{t.fare.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TripsTable;

