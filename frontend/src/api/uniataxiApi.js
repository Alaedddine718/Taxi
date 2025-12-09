// frontend/src/api/uniataxiApi.js
import API_BASE_URL from "../config/apiConfig";

// Función genérica para hacer peticiones
async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    // Lanzamos un error para que el hook lo capture
    const text = await res.text();
    throw new Error(`Error HTTP ${res.status}: ${text}`);
  }

  return res.json();
}

// Llamar a /start
export function startSystem(numTaxis) {
  return request("/start", {
    method: "POST",
    body: JSON.stringify({ num_taxis: numTaxis }),
  });
}

// Llamar a /request
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

// Llamar a /status
export function getStatus() {
  return request("/status");
}

// Llamar a /financial
export function getFinancial() {
  return request("/financial");
}

}

