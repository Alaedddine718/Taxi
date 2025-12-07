function Button({ children, variant = "primary", ...props }) {
  const styles =
    variant === "secondary"
      ? {
          background: "transparent",
          color: "#e5e7eb",
          border: "1px solid rgba(148,163,184,0.7)",
        }
      : {
          background:
            "linear-gradient(135deg, rgba(34,197,94,0.95), rgba(22,163,74,0.9))",
          color: "#022c22",
          border: "none",
        };

  return (
    <button
      {...props}
      style={{
        padding: "0.4rem 0.9rem",
        borderRadius: "999px",
        fontSize: "0.85rem",
        fontWeight: 600,
        cursor: "pointer",
        ...styles,
        opacity: props.disabled ? 0.6 : 1,
      }}
    >
      {children}
    </button>
  );
}

export default Button;
