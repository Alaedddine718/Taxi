import Card from "../common/Card";
import DataTable from "../common/DataTable";

function TripsTable({ trips }) {
  const columns = [
    { key: "id", header: "ID" },
    { key: "client_id", header: "Cliente" },
    { key: "taxi_id", header: "Taxi" },
    { key: "status", header: "Estado" },
    {
      key: "distance",
      header: "Distancia",
      render: (t) => `${t.distance.toFixed(2)} u.`,
    },
    {
      key: "fare",
      header: "Tarifa",
      render: (t) => `${t.fare.toFixed(2)} €`,
    },
  ];

  return (
    <Card title="Viajes" subtitle="Histórico de viajes registrados">
      <DataTable
        columns={columns}
        data={trips || []}
        emptyMessage="Sin viajes"
      />
    </Card>
  );
}

export default TripsTable;
