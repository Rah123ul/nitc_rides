// ─────────────────────────────────────────────────────────────────
// API HELPER
// Reads base URL from .env so localhost:5000 in dev, live URL in prod.
// ─────────────────────────────────────────────────────────────────
export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("nitcrides_token");
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "API Error");
  return data;
};
