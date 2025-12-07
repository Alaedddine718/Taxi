import { httpClient } from "./httpClient";

// Inicializar sistema (nº de taxis)
export function startSystem({ numTaxis }) {
  return httpClient.post("/start", { num_taxis: numTaxis });
}

// Crear una solicitud de taxi (crea cliente implícito)
export function requestTaxi({ name, origin_x, origin_y, dest_x, dest_y }) {
  return httpClient.post("/request", {
    name,
    origin_x,
    origin_y,
    dest_x,
    dest_y,
  });
}

// Estado global del sistema (taxis, clientes, viajes)
export function getStatus() {
  return httpClient.get("/status");
}

// Resumen económico (80/20)
export function getFinancial() {
  return httpClient.get("/financial");
}

