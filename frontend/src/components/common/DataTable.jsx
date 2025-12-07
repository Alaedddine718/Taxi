function DataTable({ columns, data, emptyMessage = "Sin datos" }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderSpacing: 0,
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  textAlign: "left",
                  padding: "0.4rem 0.4rem",
                  borderBottom: "1px solid rgba(148,163,184,0.5)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} style={{ padding: "0.5rem 0.4rem" }}>
                <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                  {emptyMessage}
                </span>
              </td>
            </tr>
          )}
          {data.map((row, idx) => (
            <tr
              key={idx}
              style={{
                borderBottom: "1px solid rgba(30,64,175,0.35)",
              }}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{
                    padding: "0.4rem 0.4rem",
                    fontSize: "0.8rem",
                  }}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
