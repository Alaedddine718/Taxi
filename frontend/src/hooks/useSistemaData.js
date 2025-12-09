// frontend/src/hooks/useSistemaData.js
import { useEffect, useState } from "react";
import { getStatus } from "../api/uniataxiApi";

// Hook muy sencillo: carga /status una vez
// y permite recargar a mano cuando queramos.
function useSistemaData() {
  const [systemData, setSystemData] = useState(null);   // datos del backend
  const [loading, setLoading] = useState(true);         // true solo al principio
  const [error, setError] = useState(null);             // guarda mensaje de error

  async function loadOnce() {
    setLoading(true);
    try {
      const data = await getStatus();       // llamada a GET /status
      setSystemData(data);                 // guardamos taxis, clientes, viajes
      setError(null);
    } catch (e) {
      console.error("Error al obtener /status", e);
      setError(e.message || "Error al obtener datos del backend");
    } finally {
      setLoading(false);                   // siempre dejamos de cargar
    }
  }

  // Se ejecuta una vez cuando se monta el componente
  useEffect(() => {
    loadOnce();
  }, []);

  // devolvemos los datos y la función para recargar
  return { systemData, loading, error, reload: loadOnce };
}

export default useSistemaData;





