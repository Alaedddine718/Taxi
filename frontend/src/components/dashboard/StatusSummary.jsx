// frontend/src/components/dashboard/StatusSummary.jsx
import { useSistema } from "../../context/SistemaContext";

function StatusSummary() {
  const { systemData, loading, error } = useSistema();

  // Evitar reventar si todavía no hay datos
  const safeData = systemData || {};

  const taxis = safeData.taxis || [];
  const trips = safeData.trips || [];

  // Cálculos muy sencillos
  const taxisLibres = taxis.filter(
    (t) => t.status === "free" || t.estado === "libre" || t.ocupado === false
  ).length;

  const taxisOcupados = taxis.length - taxisLibres;

  const viajesEnCurso = trips.filter(
    (v) =>
      v.status === "in_progress" ||
      v.estado === "en curso" ||
      v.estado === "en_progreso"
  ).length;

  if (loading) {
    // El Dashboard ya enseña cosas; aquí no pintamos nada mientras carga
    return null;
  }

  if (error) {
    return (
      <div
        style={{
          padding: "0.75rem 1rem",
          borderRadius: "0.75rem",
          background: "rgba(127,29,29,0.35)",
          color: "#fecaca",
          fontSize: "0.85rem",
          marginBottom: "1rem",
        }}
      >
        Error al obtener estado del sistema: {error}
      </div>
    );
  }

  return (
    <section
      style={{
        marginTop: "1rem",
        padding: "1.25rem 1.5rem",
        borderRadius: "0.9rem",
        background: "rgba(15,23,42,0.9)",
        border: "1px solid rgba(30,64,175,0.5)",
      }}
    >
      <h2
        style={{
          margin: 0,
          marginBottom: "0.75rem",
          fontSize: "1rem",
          fontWeight: 600,
          color: "#e5e7eb",
        }}
      >
        Estado general del sistema
      </h2>

      <p
        style={{
          margin: 0,
          marginBottom: "0.5rem",
          fontSize: "0.85rem",
          color: "#9ca3af",
        }}
      >
        Resumen rápido de taxis y viajes.
      </p>

      <ul
        style={{
          listStyle: "disc",
          paddingLeft: "1.25rem",
          margin: 0,
          fontSize: "0.9rem",
          color: "#e5e7eb",
        }}
      >
        <li>Taxis libres: {taxisLibres}</li>
        <li>Taxis ocupados: {taxisOcupados}</li>
        <li>Viajes en curso: {viajesEnCurso}</li>
      </ul>
    </section>
  );
}

export default StatusSummary;


