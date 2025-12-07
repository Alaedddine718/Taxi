function Loader() {
  return (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <div
        style={{
          width: "14px",
          height: "14px",
          borderRadius: "999px",
          border: "2px solid rgba(148,163,184,0.6)",
          borderTopColor: "#22c55e",
          animation: "spin 0.7s linear infinite",
        }}
      />
      <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>Cargando...</span>
      <style>
        {`@keyframes spin {from {transform: rotate(0deg);} to {transform: rotate(360deg);}}`}
      </style>
    </div>
  );
}

export default Loader;
