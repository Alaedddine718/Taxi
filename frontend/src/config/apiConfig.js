// Configuración de la API backend
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeoutMs: 8000,
};
