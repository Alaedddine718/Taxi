// frontend/src/api/httpClient.js
import apiConfig from "../config/apiConfig";

async function request(path, options = {}) {
  const url = `${apiConfig.baseURL}${path}`;

  const controller = new AbortController();
  const timeout = apiConfig.timeout || 8000;
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      ...options,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Error HTTP", response.status, text);
      throw new Error(`Error ${response.status}: ${text}`);
    }

    // Si no hay contenido, devolvemos null
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } finally {
    clearTimeout(id);
  }
}

export function get(path) {
  return request(path, { method: "GET" });
}

export function post(path, body) {
  return request(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}


