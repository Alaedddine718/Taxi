import Card from "../common/Card";
import DataTable from "../common/DataTable";

function TaxiTable({ taxis }) {
  const columns = [
    { key: "id", header: "ID" },
    {
      key: "pos",
      header: "Posición",
      render: (t) => `(${t.x}, ${t.y})`,
    },
    {
      key: "busy",
      header: "Estado",
      render: (t) => (t.busy ? "Ocupado" : "Libre"),
    },
    {
      key: "current_trip_id",
      header: "Viaje actual",
      render: (t) => t.current_trip_id ?? "-",
    },
    {
      key: "rating",
      header: "Rating",
      render: (t) => t.rating.toFixed(2),
    },
    {
      key: "total_earnings",
      header: "Ganancias totales",
      render: (t) => `${t.total_earnings.toFixed(2)} €`,
    },
  ];

  return (
    <Card title="Taxis" subtitle="Listado de taxis en el sistema">
      <DataTable columns={columns} data={taxis || []} emptyMessage="Sin taxis" />
    </Card>
  );
}

export default TaxiTable;
