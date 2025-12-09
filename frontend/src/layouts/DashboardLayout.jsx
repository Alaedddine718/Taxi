// frontend/src/layouts/DashboardLayout.jsx
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>
      {now.toLocaleDateString()} {now.toLocaleTimeString()}
    </span>
  );
}

function DashboardLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #182848 0, #050816 60%, #02010a 100%)",
        color: "white",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "220px",
          padding: "1rem",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>UNIETAXI</div>
          <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>Sistema de taxis</div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <NavItem to="/dashboard" label="Dashboard" />
          <NavItem to="/taxis" label="Taxis" />
          <NavItem to="/clientes" label="Clientes" />
          <NavItem to="/viajes" label="Viajes" />
          <NavItem to="/admin" label="Admin / Finanzas" />
        </nav>
      </aside>

      {/* Contenido principal */}
      <main style={{ flex: 1, padding: "1rem 1.5rem", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <div>
            <div style={{ fontWeight: 500 }}>Panel de control</div>
            <div style={{ fontSize: "0.8rem", opacity: 0.75 }}>
              Simulación de sincronización y comunicación entre hilos (UNIETAXI)
            </div>
          </div>
          <Clock />
        </header>

        {/* Contenido renderizado por las rutas */}
        <section style={{ flex: 1 }}>{children}</section>
      </main>
    </div>
  );
}

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: "block",
        padding: "0.45rem 0.6rem",
        borderRadius: "0.5rem",
        textDecoration: "none",
        fontSize: "0.9rem",
        color: isActive ? "#0dcaf0" : "rgba(255,255,255,0.8)",
        background: isActive ? "rgba(13, 202, 240, 0.15)" : "transparent",
      })}
    >
      {label}
    </NavLink>
  );
}

export default DashboardLayout;

