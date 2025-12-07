function Card({ title, subtitle, children }) {
  return (
    <div
      style={{
        background: "rgba(15,23,42,0.9)",
        borderRadius: "0.75rem",
        border: "1px solid rgba(148,163,184,0.4)",
        padding: "0.9rem 1rem",
        boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
      }}
    >
      {(title || subtitle) && (
        <div style={{ marginBottom: "0.6rem" }}>
          {title && (
            <div style={{ fontSize: "0.95rem", fontWeight: 600 }}>{title}</div>
          )}
          {subtitle && (
            <div style={{ fontSize: "0.75rem", opacity: 0.75 }}>{subtitle}</div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export default Card;
