import { useEffect, useState, useCallback } from "react";
import { getStatus } from "../api/uniataxiApi";

// cada cuántos milisegundos queremos refrescar los datos
const POLLING_INTERVAL_MS = 5000; // 5 segundos

export function useSistemaData() {
  const [systemData, setSystemData] = useState({
    taxis: [],
    clients: [],
    trips: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Hace UNA petición a /status
  const fetchStatusOnce = useCallback(async () => {
    try {
      const data = await getStatus();
      setSystemData(data);
      setError("");
      setLoading(false);
    } catch (e) {
      console.error("Error al obtener /status", e);
      setError("No se pudo obtener el estado del sistema");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // petición inicial
    fetchStatusOnce();

    // polling cada X milisegundos
    const id = setInterval(fetchStatusOnce, POLLING_INTERVAL_MS);

    // limpiar intervalo cuando se desmonta
    return () => clearInterval(id);
  }, [fetchStatusOnce]);

  return {
    systemData,
    loading,
    error,
    // para usarlo manualmente después de /start o /request
    reload: fetchStatusOnce,
  };
}



