const BASE_URL = "http://127.0.0.1:8000";

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Error HTTP ${res.status}`);
  }
  return res.json();
}

export async function getStatus() {
  const res = await fetch(`${BASE_URL}/status`);
  return handleResponse(res);
}

export async function startSystem(numTaxis) {
  const res = await fetch(`${BASE_URL}/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ num_taxis: numTaxis }),
  });
  return handleResponse(res);
}

export async function createRequest({
  clientName,
  originX,
  originY,
  destX,
  destY,
}) {
  const res = await fetch(`${BASE_URL}/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_name: clientName,
      origin_x: originX,
      origin_y: originY,
      dest_x: destX,
      dest_y: destY,
    }),
  });
  return handleResponse(res);
}

export async function getFinancial() {
  const res = await fetch(`${BASE_URL}/financial`);
  return handleResponse(res);
}

