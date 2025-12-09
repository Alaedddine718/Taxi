// frontend/src/pages/AdminPage.jsx
import { useEffect, useState } from "react";
import { getFinancial } from "../api/uniataxiApi";
import { useSistema } from "../context/SistemaContext";
import Card from "../components/common/Card";
import Loader from "../components/common/Loader";

function AdminPage() {
  // Datos generales del sistema (taxis, clientes, viajes)
  const { systemData, loading: loadingStatus, error: statusError, reload } = useSistema();

  // Datos financieros
  const [financial, setFinancial] = useState(null);
  const [loadingFinancial, setLoadingFinancial] = useState(false);
  const [financialError, setFinancialError] = useState(null);

  async function loadFinancial() {
    setLoadingFinancial(true);
    setFinancialError(null);
    try {
      const data = await getFinancial();
      setFinancial(data);
    } catch (e) {
      console.error("Error al obtener /financial", e);
      setFinancialError("Error al obtener datos financieros");
    } finally {
      setLoadingFinancial(false);
    }
  }

  useEffect(() => {
    loadFinancial();
  }, []);

  const trips = systemData?.trips || [];

  // Elegimos hasta 5 viajes para el "seguimiento"
  const trackedTrips = trips.slice(0, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: "1.3rem" }}>Admin / Cierre contable</h2>
        <button
          onClick={() => {
            reload();
            loadFinancial();
          }}
          style={{
            padding: "0.4rem 0.8rem",
            borderRadius: "0.4rem",
            border: "none",
            background: "#198754",
            color: "white",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          Actualizar datos
        </button>
      </div>

      {(loadingStatus || loadingFinancial) && (
        <div style={{ fontSize: "0.85rem" }}>
          <Loader /> Cargando datos del sistema...
        </div>
      )}

      {(statusError || financialError) && (
        <div style={{ fontSize: "0.85rem", color: "#ff6b6b" }}>
          {statusError && <div>Error estado sistema: {statusError}</div>}
          {financialError && <div>Error financiero: {financialError}</div>}
        </div>
      )}

      {/* Resumen financiero general */}
      <Card title="Ingresos del sistema">
        {financial ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "1rem",
              fontSize: "0.9rem",
            }}
          >
            <div>
              <div style={{ opacity: 0.7 }}>Viajes totales</div>
              <div style={{ fontSize: "1.2rem" }}>{financial.total_trips}</div>
            </div>
            <div>
              <div style={{ opacity: 0.7 }}>Suma de tarifas (clientes)</div>
              <div style={{ fontSize: "1.2rem" }}>{financial.total_fares.toFixed(2)} €</div>
            </div>
            <div>
              <div style={{ opacity: 0.7 }}>Ingresos empresa (20%)</div>
              <div style={{ fontSize: "1.2rem" }}>{financial.company_total.toFixed(2)} €</div>
            </div>
            <div>
              <div style={{ opacity: 0.7 }}>Ingresos taxis (80%)</div>
              <div style={{ fontSize: "1.2rem" }}>{financial.taxis_total.toFixed(2)} €</div>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: "0.85rem" }}>Sin datos todavía. Crea algún viaje.</div>
        )}
      </Card>

      {/* Ingresos por taxi */}
      <Card title="Ingresos por taxi">
        {financial && financial.per_taxi && financial.per_taxi.length > 0 ? (
          <table style={{ width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #333" }}>
                <th style={{ padding: "0.4rem" }}>ID Taxi</th>
                <th style={{ padding: "0.4rem" }}>Ingresos taxi (€)</th>
                <th style={{ padding: "0.4rem" }}>Parte empresa asociada (€)</th>
              </tr>
            </thead>
            <tbody>
              {financial.per_taxi.map((t) => (
                <tr key={t.taxi_id} style={{ borderBottom: "1px solid #222" }}>
                  <td style={{ padding: "0.4rem" }}>{t.taxi_id}</td>
                  <td style={{ padding: "0.4rem" }}>{t.taxi_earnings.toFixed(2)}</td>
                  <td style={{ padding: "0.4rem" }}>{t.company_part.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ fontSize: "0.85rem" }}>Aún no hay taxis con viajes.</div>
        )}
      </Card>

      {/* Seguimiento de 5 servicios (requisito de la enunciado) */}
      <Card title="Seguimiento de 5 servicios (ejemplo)">
        {trackedTrips.length > 0 ? (
          <table style={{ width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #333" }}>
                <th style={{ padding: "0.4rem" }}>ID Viaje</th>
                <th style={{ padding: "0.4rem" }}>ID Cliente</th>
                <th style={{ padding: "0.4rem" }}>ID Taxi</th>
                <th style={{ padding: "0.4rem" }}>Distancia</th>
                <th style={{ padding: "0.4rem" }}>Tarifa (€)</th>
              </tr>
            </thead>
            <tbody>
              {trackedTrips.map((trip) => (
                <tr key={trip.id} style={{ borderBottom: "1px solid #222" }}>
                  <td style={{ padding: "0.4rem" }}>{trip.id}</td>
                  <td style={{ padding: "0.4rem" }}>{trip.client_id}</td>
                  <td style={{ padding: "0.4rem" }}>{trip.taxi_id}</td>
                  <td style={{ padding: "0.4rem" }}>{trip.distance.toFixed(2)}</td>
                  <td style={{ padding: "0.4rem" }}>{trip.fare.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ fontSize: "0.85rem" }}>
            Aún no hay viajes registrados. Crea una solicitud de taxi desde el Dashboard.
          </div>
        )}
      </Card>
    </div>
  );
}

export default AdminPage;

