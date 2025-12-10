// frontend/src/context/SistemaContext.jsx
import { createContext, useContext } from "react";
import useSistemaData from "../hooks/useSistemaData";

const SistemaContext = createContext(null);

export function SistemaProvider({ children }) {
  const sistema = useSistemaData();
  return (
    <SistemaContext.Provider value={sistema}>
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


