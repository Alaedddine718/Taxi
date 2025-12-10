// frontend/src/hooks/useSistemaData.js
import { useEffect, useState } from "react";
import { getStatus, getFinancial } from "../api/uniataxiApi";

function useSistemaData() {
  const [systemData, setSystemData] = useState(null);
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Vuelve a pedir /status al backend
  async function refreshStatus() {
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

  // Pide los datos financieros (/financial)
  async function refreshFinancial() {
    try {
      const data = await getFinancial();
      setFinancialData(data);
    } catch (e) {
      console.error("Error al obtener /financial", e);
      // no tocamos error global para no romper otras pantallas
    }
  }

  // Al montar la app, cargamos el estado inicial
  useEffect(() => {
    refreshStatus();
  }, []);

  return {
    systemData,
    financialData,
    loading,
    error,
    refreshStatus,
    refreshFinancial,
  };
}

export default useSistemaData;









