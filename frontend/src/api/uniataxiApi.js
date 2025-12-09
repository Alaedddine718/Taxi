// frontend/src/api/uniataxiApi.js
import API_BASE_URL from "../config/apiConfig";

// Función genérica para hacer peticiones al backend
async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  return res.json();
}

// POST /start
export function startSystem(numTaxis) {
  return request("/start", {
    method: "POST",
    body: JSON.stringify({ num_taxis: numTaxis }),
  });
}

// POST /request
export function requestTaxi({ name, originX, originY, destX, destY }) {
  return request("/request", {
    method: "POST",
    body: JSON.stringify({
      name,
      origin_x: originX,
      origin_y: originY,
      dest_x: destX,
      dest_y: destY,
    }),
  });
}

// GET /status
export function getStatus() {
  return request("/status");
}

// GET /financial
export function getFinancial() {
  return request("/financial");
}
