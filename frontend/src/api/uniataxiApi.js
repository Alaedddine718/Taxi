// frontend/src/api/uniataxiApi.js
import { get, post } from "./httpClient";

export async function getStatus() {
  return get("/status");
}

export async function startSystem(numTaxis) {
  return post("/start", { num_taxis: Number(numTaxis) });
}

export async function createRequest(payload) {
  // payload: { client_name, origin_x, origin_y, dest_x, dest_y }
  return post("/request", payload);
}

export async function getFinancial() {
  return get("/financial");
}

// ⭐ NUEVO: valorar un taxi (1–5)
export async function rateTaxi(taxiId, rating) {
  return post("/rate", {
    taxi_id: Number(taxiId),
    rating: Number(rating),
  });
}


