// frontend/src/components/dashboard/KPICards.jsx
import { useSistema } from "../../context/SistemaContext";

function KPICards() {
  // Sacamos los datos del contexto
  const { systemData, loading, error } = useSistema();

  // Si todavía no tenemos datos del backend, usamos valores por defecto
  const safeData = systemData || {};

  const taxis = safeData.taxis || [];
  const clients = safeData.clients || [];
  const trips = safeData.trips || [];

  const taxisRegistrados = taxis.length;
  const clientesRegistrados = clients.length;
  const viajesTotales = trips.length;
  const viajesFinalizados = trips.filter(
    (t) => t.status === "finished" || t.estado === "finalizado"
  ).length;

  // Mientras carga, no mostramos nada especial (el Dashboard ya enseña cosas)
  if (loading) {
    return null;
  }

  // Si hay error en el contexto, mostramos una tarjeta con el error
  if (error) {
    return (
      <div
        style={{
          padding: "1rem",
          marginBottom: "1rem",
          borderRadius: "0.75rem",
          background: "rgba(148, 27, 27, 0.25)",
          color: "#fecaca",
          fontSize: "0.9rem",
        }}
      >
        Error al obtener datos del sistema: {error}
      </div>
    );
  }

  // Tarjetas simples de KPIs
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: "1rem",
        marginBottom: "1.5rem",
      }}
    >
      <div
        style={{
          padding: "1rem 1.25rem",
          borderRadius: "0.75rem",
          background:
            "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(15,23,42,0.9))",
          border: "1px solid rgba(59,130,246,0.3)",
        }}
      >
        <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: 4 }}>
          Taxis registrados
        </div>
        <div style={{ fontSize: "1.5rem", fontWeight: 600 }}>{taxisRegistrados}</div>
      </div>

      <div
        style={{
          padding: "1rem 1.25rem",
          borderRadius: "0.75rem",
          background:
            "linear-gradient(135deg, rgba(34,197,94,0.2), rgba(15,23,42,0.9))",
          border: "1px solid rgba(34,197,94,0.3)",
        }}
      >
        <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: 4 }}>
          Clientes registrados
        </div>
        <div style={{ fontSize: "1.5rem", fontWeight: 600 }}>
          {clientesRegistrados}
        </div>
      </div>

      <div
        style={{
          padding: "1rem 1.25rem",
          borderRadius: "0.75rem",
          background:
            "linear-gradient(135deg, rgba(249,115,22,0.2), rgba(15,23,42,0.9))",
          border: "1px solid rgba(249,115,22,0.3)",
        }}
      >
        <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: 4 }}>
          Viajes totales
        </div>
        <div style={{ fontSize: "1.5rem", fontWeight: 600 }}>{viajesTotales}</div>
      </div>

      <div
        style={{
          padding: "1rem 1.25rem",
          borderRadius: "0.75rem",
          background:
            "linear-gradient(135deg, rgba(236,72,153,0.2), rgba(15,23,42,0.9))",
          border: "1px solid rgba(236,72,153,0.3)",
        }}
      >
        <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: 4 }}>
          Viajes finalizados
        </div>
        <div style={{ fontSize: "1.5rem", fontWeight: 600 }}>
          {viajesFinalizados}
        </div>
      </div>
    </div>
  );
}

export default KPICards;


