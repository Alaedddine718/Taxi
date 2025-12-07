import { createContext, useContext, useState } from "react";
import { useSistemaData } from "../hooks/useSistemaData";

const SistemaContext = createContext(null);

export function SistemaProvider({ children }) {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { data, loading, error, forceReload } = useSistemaData({
    enabled: autoRefresh,
  });

  return (
    <SistemaContext.Provider
      value={{
        systemData: data,
        loading,
        error,
        autoRefresh,
        setAutoRefresh,
        reload: forceReload,
      }}
    >
      {children}
    </SistemaContext.Provider>
  );
}

export function useSistema() {
  const ctx = useContext(SistemaContext);
  if (!ctx) {
    throw new Error("useSistema debe usarse dentro de <SistemaProvider>");
  }
  return ctx;
}
