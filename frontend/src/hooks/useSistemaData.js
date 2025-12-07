import { useEffect, useState, useCallback } from "react";
import { getStatus } from "../api/uniataxiApi";

const EMPTY_DATA = {
  taxis: [],
  clients: [],
  trips: [],
};

export function useSistemaData({ enabled = true, intervalMs = 1000 } = {}) {
  const [data, setData] = useState(EMPTY_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getStatus();
      setData({
        taxis: res.taxis || [],
        clients: res.clients || [],
        trips: res.trips || [],
      });
    } catch (e) {
      console.error(e);
      setError(e.message || "Error al obtener estado");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    fetchData();
    const id = setInterval(fetchData, intervalMs);
    return () => clearInterval(id);
  }, [enabled, intervalMs, fetchData]);

  const forceReload = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, forceReload };
}
