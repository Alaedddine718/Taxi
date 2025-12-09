// frontend/src/components/tables/ClientsTable.jsx

function ClientsTable({ clients }) {
  if (!clients || clients.length === 0) {
    return <div style={{ fontSize: "0.85rem" }}>No hay clientes registrados todavía.</div>;
  }

  return (
    <table style={{ width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ textAlign: "left", borderBottom: "1px solid #333" }}>
          <th style={{ padding: "0.4rem" }}>ID</th>
          <th style={{ padding: "0.4rem" }}>Nombre</th>
        </tr>
      </thead>
      <tbody>
        {clients.map((c) => (
          <tr key={c.id} style={{ borderBottom: "1px solid #222" }}>
            <td style={{ padding: "0.4rem" }}>{c.id}</td>
            <td style={{ padding: "0.4rem" }}>{c.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ClientsTable;


