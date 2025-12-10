// frontend/src/pages/AdminPage.jsx
import { useSistema } from "../context/SistemaContext";
import Loader from "../components/common/Loader";

// Función auxiliar para asegurarnos de que siempre tenemos un número
function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isNaN(n) ? fallback : n;
}

function AdminPage() {
  // AHORA sí usamos el contexto directamente
  const { systemData, financialData, loading, error, refreshFinancial } =
    useSistema();

  const trips = systemData?.trips || systemData?.viajes || [];
  const totalTrips = trips.length;

  const totalFareNumber = num(
    financialData?.total_fares ??
      financialData?.total_fare ??
      financialData?.totalFare,
    0
  );

  const companyIncomeNumber = num(
    financialData?.company_income ??
      financialData?.empresa ??
      totalFareNumber * 0.2,
    0
  );

  const driversIncomeNumber = num(
    financialData?.taxis_income ??
      financialData?.drivers_income ??
      (totalFareNumber - companyIncomeNumber),
    0
  );

  const totalFare = totalFareNumber.toFixed(2);
  const companyIncome = companyIncomeNumber.toFixed(2);
  const driversIncome = driversIncomeNumber.toFixed(2);

  const trackedTrips = trips.slice(0, 5);

  if (loading && !systemData && !financialData) {
    return (
      <div style={{ padding: "2rem" }}>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <main style={{ padding: "2rem", color: "#fecaca" }}>
        <h1 style={{ fontSize: "1.3rem", marginBottom: "0.75rem" }}>
          Admin / Cierre contable
        </h1>
        <p>Backend no disponible o error al obtener datos financieros.</p>
        <button
          onClick={refreshFinancial}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            borderRadius: "999px",
            border: "none",
            backgroundColor: "#22c55e",
            color: "#0b1120",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Reintentar
        </button>
      </main>
    );
  }

  return (
    <main style={{ padding: "1.75rem 2rem" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Admin / Cierre contable</h1>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#9ca3af",
              marginTop: "0.25rem",
            }}
          >
            Resumen simple de ingresos del sistema UNIETAXI.
          </p>
        </div>
        <button
          onClick={refreshFinancial}
          style={{
            padding: "0.45rem 1.25rem",
            borderRadius: "999px",
            border: "none",
            backgroundColor: "#22c55e",
            color: "#0b1120",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Actualizar datos
        </button>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <InfoBox
          title="Viajes totales"
          value={totalTrips}
          subtitle="Número total de servicios registrados"
        />
        <InfoBox
          title="Suma de tarifas (clientes)"
          value={`${totalFare} €`}
          subtitle="Dinero facturado a los clientes"
        />
        <InfoBox
          title="Ingresos empresa (20%)"
          value={`${companyIncome} €`}
          subtitle="Comisión UNIETAXI"
        />
        <InfoBox
          title="Ingresos taxis (80%)"
          value={`${driversIncome} €`}
          subtitle="Total repartido entre taxistas"
        />
      </section>

      <section
        style={{
          marginBottom: "1.5rem",
          padding: "1rem 1.25rem",
          borderRadius: "0.75rem",
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(15,23,42,0.6))",
        }}
      >
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
          Ingresos por taxi
        </h2>
        <p style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
          Versión simplificada: mostramos sólo los totales globales. Se podría
          extender a una tabla por taxi si el profesor lo pide.
        </p>
      </section>

      <section
        style={{
          padding: "1rem 1.25rem",
          borderRadius: "0.75rem",
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(15,23,42,0.6))",
        }}
      >
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>
          Seguimiento de 5 servicios (ejemplo)
        </h2>
        {trackedTrips.length === 0 ? (
          <p style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
            Aún no hay viajes registrados. Crea solicitudes de taxi desde el Dashboard.
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.9rem",
              color: "#e5e7eb",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "rgba(15,23,42,0.9)",
                }}
              >
                <th style={thStyle}>ID viaje</th>
                <th style={thStyle}>Cliente</th>
                <th style={thStyle}>Taxi</th>
                <th style={thStyle}>Origen</th>
                <th style={thStyle}>Destino</th>
                <th style={thStyle}>Tarifa (€)</th>
              </tr>
            </thead>
            <tbody>
              {trackedTrips.map((trip, index) => {
                const id =
                  trip.id ??
                  trip.trip_id ??
                  trip.codigo ??
                  `Viaje ${index + 1}`;

                const cliente = trip.client_name ?? trip.cliente ?? "Cliente";
                const taxi =
                  trip.taxi_id ??
                  trip.taxi ??
                  (trip.taxiCode ? `Taxi ${trip.taxiCode}` : "Taxi");

                const origen = `(${trip.origin_x ?? trip.origen_x ?? "?"}, ${
                  trip.origin_y ?? trip.origen_y ?? "?"
                })`;

                const destino = `(${trip.dest_x ?? trip.destino_x ?? "?"}, ${
                  trip.dest_y ?? trip.destino_y ?? "?"
                })`;

                const fareNumber = num(
                  trip.fare ?? trip.tarifa ?? trip.price,
                  0
                );
                const fare = fareNumber.toFixed(2);

                return (
                  <tr
                    key={id}
                    style={{
                      backgroundColor:
                        index % 2 === 0
                          ? "rgba(15,23,42,0.8)"
                          : "rgba(15,23,42,0.6)",
                    }}
                  >
                    <td style={tdStyle}>{id}</td>
                    <td style={tdStyle}>{cliente}</td>
                    <td style={tdStyle}>{taxi}</td>
                    <td style={tdStyle}>{origen}</td>
                    <td style={tdStyle}>{destino}</td>
                    <td style={tdStyle}>{fare}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}

function InfoBox({ title, value, subtitle }) {
  return (
    <div
      style={{
        padding: "1rem 1.25rem",
        borderRadius: "0.75rem",
        background:
          "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.7))",
      }}
    >
      <p
        style={{
          fontSize: "0.85rem",
          color: "#9ca3af",
          marginBottom: "0.35rem",
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontSize: "1.35rem",
          fontWeight: 600,
          margin: 0,
        }}
      >
        {value}
      </p>
      {subtitle && (
        <p
          style={{
            fontSize: "0.8rem",
            color: "#6b7280",
            marginTop: "0.3rem",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "0.5rem 0.75rem",
  borderBottom: "1px solid rgba(55,65,81,0.7)",
  fontWeight: 600,
  fontSize: "0.85rem",
};

const tdStyle = {
  padding: "0.45rem 0.75rem",
  borderBottom: "1px solid rgba(31,41,55,0.7)",
};

export default AdminPage;



