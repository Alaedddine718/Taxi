// frontend/src/pages/ClientesPage.jsx
import { useState } from "react";
import { useSistema } from "../context/sistemaContext"; // 👈 IMPORT CORREGIDO
import { rateTaxi } from "../api/uniataxiApi";

function ClientesPage() {
  const { systemData, refreshStatus } = useSistema();
  const [ratingPorCliente, setRatingPorCliente] = useState({});
  const [mensaje, setMensaje] = useState("");

  if (!systemData) {
    return <p style={{ color: "white" }}>Cargando datos...</p>;
  }

  const clients = systemData.clients || [];
  const trips = systemData.trips || [];

  // Obtener viajes de un cliente por nombre
  const getViajesCliente = (nombre) =>
    trips.filter((t) => t.client_name === nombre);

  const handleChangeRating = (clientId, value) => {
    setRatingPorCliente((prev) => ({
      ...prev,
      [clientId]: value,
    }));
  };

  const handleValorar = async (client) => {
    setMensaje("");

    const viajesCliente = getViajesCliente(client.name);
    if (viajesCliente.length === 0) {
      setMensaje(`El cliente ${client.name} aún no tiene viajes para valorar.`);
      return;
    }

    // Usamos el ÚLTIMO viaje del cliente para valorar al taxi que le llevó
    const ultimoViaje = viajesCliente[viajesCliente.length - 1];
    const taxiId = ultimoViaje.taxi_id;

    const ratingSeleccionado =
      Number(ratingPorCliente[client.id]) || 5; // por defecto 5

    try {
      await rateTaxi(taxiId, ratingSeleccionado);
      setMensaje(
        `Has valorado al taxi ${taxiId} con ${ratingSeleccionado} estrellas.`
      );
      // refrescar datos del sistema para ver rating medio actualizado
      await refreshStatus();
    } catch (err) {
      console.error(err);
      setMensaje("Error al enviar la valoración.");
    }
  };

  return (
    <main style={{ padding: "1.5rem", color: "white" }}>
      <h1>Clientes</h1>
      <p style={{ marginBottom: "1rem" }}>
        Aquí se muestran los clientes registrados y puedes valorar el taxi del
        último viaje de cada uno (1 a 5 estrellas).
      </p>

      {mensaje && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#1f2933",
            borderRadius: "4px",
          }}
        >
          {mensaje}
        </div>
      )}

      {clients.length === 0 ? (
        <p>No hay clientes registrados todavía.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#111827",
          }}
        >
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #374151", padding: "8px" }}>
                ID
              </th>
              <th style={{ borderBottom: "1px solid #374151", padding: "8px" }}>
                Nombre
              </th>
              <th style={{ borderBottom: "1px solid #374151", padding: "8px" }}>
                Nº viajes
              </th>
              <th style={{ borderBottom: "1px solid #374151", padding: "8px" }}>
                Último taxi
              </th>
              <th style={{ borderBottom: "1px solid #374151", padding: "8px" }}>
                Valorar taxi
              </th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => {
              const viajesCliente = getViajesCliente(c.name);
              const numViajes = viajesCliente.length;
              const ultimoViaje =
                numViajes > 0 ? viajesCliente[numViajes - 1] : null;
              const ultimoTaxiId = ultimoViaje ? ultimoViaje.taxi_id : "-";

              return (
                <tr key={c.id}>
                  <td
                    style={{
                      borderBottom: "1px solid #374151",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    {c.id}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid #374151",
                      padding: "8px",
                    }}
                  >
                    {c.name}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid #374151",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    {numViajes}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid #374151",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    {ultimoTaxiId}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid #374151",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    {numViajes === 0 ? (
                      <span style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                        Sin viajes aún
                      </span>
                    ) : (
                      <>
                        <select
                          value={ratingPorCliente[c.id] || "5"}
                          onChange={(e) =>
                            handleChangeRating(c.id, e.target.value)
                          }
                          style={{
                            marginRight: "0.5rem",
                            padding: "0.2rem",
                            backgroundColor: "#111827",
                            color: "white",
                            borderRadius: "4px",
                          }}
                        >
                          <option value="1">★☆☆☆☆ (1)</option>
                          <option value="2">★★☆☆☆ (2)</option>
                          <option value="3">★★★☆☆ (3)</option>
                          <option value="4">★★★★☆ (4)</option>
                          <option value="5">★★★★★ (5)</option>
                        </select>
                        <button
                          onClick={() => handleValorar(c)}
                          style={{
                            padding: "0.2rem 0.6rem",
                            backgroundColor: "#2563eb",
                            color: "white",
                            borderRadius: "4px",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Enviar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
}

export default ClientesPage;





