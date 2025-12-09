// frontend/src/hooks/useSistemaData.js
import { useEffect, useState } from "react";
import { getStatus } from "../api/uniataxiApi";

function useSistemaData() {
  const [systemData, setSystemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadOnce() {
    setLoading(true);
    try {
      const data = await getStatus();
      setSystemData(data);
      setError(null);
    } catch (e) {
      console.error("Error al obtener /status", e);
      setError(e.message || "Error al obtener datos del backend");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOnce();
  }, []);

  return { systemData, loading, error, reload: loadOnce };
}

export default useSistemaData;







