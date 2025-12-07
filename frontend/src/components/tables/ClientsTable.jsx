import Card from "../common/Card";
import DataTable from "../common/DataTable";

function ClientsTable({ clients }) {
  const columns = [
    { key: "id", header: "ID" },
    { key: "name", header: "Nombre" },
    {
      key: "origin",
      header: "Origen",
      render: (c) => `(${c.origin_x}, ${c.origin_y})`,
    },
    {
      key: "dest",
      header: "Destino",
      render: (c) => `(${c.dest_x}, ${c.dest_y})`,
    },
    {
      key: "rating_given",
      header: "Rating dado",
      render: (c) =>
        c.rating_given != null ? c.rating_given.toFixed(2) : "-",
    },
  ];

  return (
    <Card title="Clientes" subtitle="Clientes que han solicitado viajes">
      <DataTable
        columns={columns}
        data={clients || []}
        emptyMessage="Sin clientes"
      />
    </Card>
  );
}

export default ClientsTable;

