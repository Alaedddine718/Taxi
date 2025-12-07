function Modal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 30,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#020617",
          border: "1px solid rgba(148,163,184,0.7)",
          borderRadius: "0.75rem",
          padding: "1rem 1.25rem",
          minWidth: "260px",
          maxWidth: "480px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div
            style={{
              fontWeight: 600,
              fontSize: "0.95rem",
              marginBottom: "0.5rem",
            }}
          >
            {title}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export default Modal;
