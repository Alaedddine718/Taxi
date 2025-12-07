import EarningsChart from "../components/charts/EarningsChart";

function AdminPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Admin / Cierre contable</h2>
      <p style={{ fontSize: "0.85rem", opacity: 0.85 }}>
        Aquí puedes visualizar las ganancias estimadas por taxi y el total para
        la empresa (20% de comisión sobre lo facturado).
      </p>
      <EarningsChart />
    </div>
  );
}

export default AdminPage;
