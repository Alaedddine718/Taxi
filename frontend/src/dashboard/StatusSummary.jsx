import Card from "../common/Card";

function StatusSummary({ systemData }) {
  const { taxis = [], trips = [] } = systemData;

  const taxisOcupados = taxis.filter((t) => t.busy).length;
  const taxisLibres = taxis.filter((t) => !t.busy).length;
  const viajesEnCurso = trips.filter((t) => t.status === "ongoing").length;

  return (
    <Card
      title="Estado general del sistema"
      subtitle="Resumen rápido de taxis y viajes"
    >
      <ul style={{ paddingLeft: "1rem", margin: 0, fontSize: "0.85rem" }}>
        <li>
          Taxis libres: <strong>{taxisLibres}</strong>
        </li>
        <li>
          Taxis ocupados: <strong>{taxisOcupados}</strong>
        </li>
        <li>
          Viajes en curso: <strong>{viajesEnCurso}</strong>
        </li>
      </ul>
    </Card>
  );
}

export default StatusSummary;
