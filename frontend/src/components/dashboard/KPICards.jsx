import Card from "../common/Card";

function KPICards({ systemData }) {
  const { taxis = [], clients = [], trips = [] } = systemData;

  const totalTaxis = taxis.length;
  const totalClientes = clients.length;
  const totalViajes = trips.length;
  const viajesTerminados = trips.filter((t) => t.status === "finished").length;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "0.75rem",
        marginBottom: "1rem",
      }}
    >
      <Card title="Taxis registrados">
        <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>{totalTaxis}</div>
      </Card>

      <Card title="Clientes registrados">
        <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>{totalClientes}</div>
      </Card>

      <Card title="Viajes totales">
        <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>{totalViajes}</div>
      </Card>

      <Card title="Viajes finalizados">
        <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>
          {viajesTerminados}
        </div>
      </Card>
    </div>
  );
}

export default KPICards;

