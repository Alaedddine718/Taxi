// frontend/src/components/tables/TaxiTable.jsx

function TaxiTable({ taxis }) {
  if (!taxis || taxis.length === 0) {
    return <div style={{ fontSize: "0.85rem" }}>No hay taxis registrados todavía.</div>;
  }

  return (
    <table style={{ width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ textAlign: "left", borderBottom: "1px solid #333" }}>
          <th style={{ padding: "0.4rem" }}>ID</th>
          <th style={{ padding: "0.4rem" }}>Posición (x, y)</th>
          <th style={{ padding: "0.4rem" }}>Estado</th>
          <th style={{ padding: "0.4rem" }}>Ingresos (€)</th>
        </tr>
      </thead>
      <tbody>
        {taxis.map((t) => (
          <tr key={t.id} style={{ borderBottom: "1px solid #222" }}>
            <td style={{ padding: "0.4rem" }}>{t.id}</td>
            <td style={{ padding: "0.4rem" }}>
              ({t.x}, {t.y})
            </td>
            <td style={{ padding: "0.4rem" }}>{t.status}</td>
            <td style={{ padding: "0.4rem" }}>{t.total_earnings.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TaxiTable;

