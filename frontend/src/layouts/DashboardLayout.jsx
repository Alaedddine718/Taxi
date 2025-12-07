import Clock from "../components/common/Clock";
import { Link, useLocation } from "react-router-dom";

function DashboardLayout({ children }) {
  const location = useLocation();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateRows: "auto 1fr",
        background: "#0f172a",
        color: "#e5e7eb",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.75rem 1.5rem",
          borderBottom: "1px solid rgba(148, 163, 184, 0.4)",
          background:
            "linear-gradient(90deg, rgba(15,23,42,0.95), rgba(30,64,175,0.7))",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "rgba(15,118,110,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "0.9rem",
            }}
          >
            U
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "1rem" }}>UNIETAXI</div>
            <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>
              Sistema de atención & simulación SO
            </div>
          </div>
        </div>

        <Clock mode="simulado" speedFactor={60} />
      </header>

      {/* Sidebar + contenido */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
        }}
      >
        <aside
          style={{
            borderRight: "1px solid rgba(148, 163, 184, 0.3)",
            padding: "1rem 0.75rem",
            background: "rgba(15,23,42,0.95)",
          }}
        >
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <NavLink to="/" active={location.pathname === "/"}>
              Dashboard
            </NavLink>
            <NavLink to="/taxis" active={location.pathname === "/taxis"}>
              Taxis
            </NavLink>
            <NavLink to="/clientes" active={location.pathname === "/clientes"}>
              Clientes
            </NavLink>
            <NavLink to="/viajes" active={location.pathname === "/viajes"}>
              Viajes
            </NavLink>
            <NavLink to="/admin" active={location.pathname === "/admin"}>
              Admin
            </NavLink>
          </nav>
        </aside>

        <main
          style={{
            padding: "1.25rem 1.5rem",
            background: "radial-gradient(circle at top, #1f2937 0, #020617 60%)",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

function NavLink({ to, children, active }) {
  return (
    <Link
      to={to}
      style={{
        textDecoration: "none",
        color: active ? "#22c55e" : "#e5e7eb",
        fontSize: "0.9rem",
        padding: "0.4rem 0.65rem",
        borderRadius: "999px",
        display: "block",
        background: active ? "rgba(34,197,94,0.12)" : "transparent",
      }}
    >
      {children}
    </Link>
  );
}

export default DashboardLayout;
