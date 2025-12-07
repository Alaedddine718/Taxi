import { useClock } from "../../hooks/useClock";

function Clock({ mode = "simulado", speedFactor = 60 }) {
  const { formattedLabel, percentageOfDay } = useClock({ mode, speedFactor });

  return (
    <div
      style={{
        padding: "0.5rem 0.75rem",
        borderRadius: "999px",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        background: "rgba(0, 0, 0, 0.25)",
        backdropFilter: "blur(6px)",
        color: "white",
        minWidth: "230px",
      }}
    >
      <div
        style={{
          fontSize: "0.75rem",
          opacity: 0.8,
          marginBottom: "0.1rem",
        }}
      >
        Reloj del sistema
      </div>
      <div style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.25rem" }}>
        {formattedLabel}
      </div>
      <div
        style={{
          height: "4px",
          width: "100%",
          borderRadius: "999px",
          background: "rgba(255, 255, 255, 0.2)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percentageOfDay}%`,
            borderRadius: "999px",
            background:
              "linear-gradient(90deg, #4ade80 0%, #22c55e 40%, #facc15 70%, #f97316 100%)",
            transition: "width 0.3s linear",
          }}
        />
      </div>
    </div>
  );
}

export default Clock;
