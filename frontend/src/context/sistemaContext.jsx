import { createContext, useContext } from "react";
import { useSistemaData } from "../hooks/useSistemaData";

const SistemaContext = createContext(null);

export function SistemaProvider({ children }) {
  const sistemaState = useSistemaData(); // { systemData, loading, error, reload }

  return (
    <SistemaContext.Provider value={sistemaState}>
      {children}
    </SistemaContext.Provider>
  );
}

export function useSistema() {
  const ctx = useContext(SistemaContext);
  if (!ctx) {
    // Si algún día se usa fuera del provider, que avise claro
    throw new Error("useSistema debe usarse dentro de un <SistemaProvider>");
  }
  return ctx;
}

