/**
 * WanderKashmir API Client
 * Central service layer — all fetch calls go through here.
 * Reads VITE_API_BASE_URL from .env (falls back to localhost:8000).
 */

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

// ── Token storage ─────────────────────────────────────────────────────────────
const TOKEN_KEY = "wk_access_token";
const REFRESH_KEY = "wk_refresh_token";

export const tokenStore = {
  get: () => sessionStorage.getItem(TOKEN_KEY),
  set: (t) => sessionStorage.setItem(TOKEN_KEY, t),
  getRefresh: () => sessionStorage.getItem(REFRESH_KEY),
  setRefresh: (t) => sessionStorage.setItem(REFRESH_KEY, t),
  clear: () => { sessionStorage.removeItem(TOKEN_KEY); sessionStorage.removeItem(REFRESH_KEY); },
};

// ── Core fetch wrapper ────────────────────────────────────────────────────────
async function request(path, options = {}) {
  const token = tokenStore.get();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  // Auto-refresh on 401
  if (res.status === 401 && tokenStore.getRefresh()) {
    const refreshed = await refreshToken();
    if (refreshed) {
      headers.Authorization = `Bearer ${tokenStore.get()}`;
      const retry = await fetch(`${BASE}${path}`, {
        ...options,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });
      if (!retry.ok) throw new ApiError(retry.status, await retry.json());
      return retry.json();
    }
    tokenStore.clear();
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(res.status, errBody);
  }

  if (res.status === 204) return null;
  return res.json();
}

// ── File upload helper ────────────────────────────────────────────────────────
export async function uploadFile(path, file) {
  const token = tokenStore.get();
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  if (!res.ok) throw new ApiError(res.status, await res.json());
  return res.json();
}

export class ApiError extends Error {
  constructor(status, body) {
    super(body?.message || body?.detail || "API error");
    this.status = status;
    this.body = body;
  }
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const auth = {
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: { email, password } }),
  me: () => request("/auth/me"),
  refresh: () =>
    request("/auth/refresh", { method: "POST", body: { refresh_token: tokenStore.getRefresh() } }),
  changePassword: (current_password, new_password) =>
    request("/auth/change-password", { method: "POST", body: { current_password, new_password } }),
  // ── Forgot password / OTP flow ──────────────────────────────────────────
  forgotPassword: (email) =>
    request("/auth/forgot-password", { method: "POST", body: { email } }),
  verifyOtp: (email, otp) =>
    request("/auth/verify-otp", { method: "POST", body: { email, otp } }),
  resetPassword: (reset_token, new_password, confirm_password) =>
    request("/auth/reset-password", { method: "POST", body: { reset_token, new_password, confirm_password } }),
};

async function refreshToken() {
  try {
    const data = await request("/auth/refresh", {
      method: "POST",
      body: { refresh_token: tokenStore.getRefresh() },
    });
    tokenStore.set(data.access_token);
    tokenStore.setRefresh(data.refresh_token);
    return true;
  } catch {
    return false;
  }
}

// ── Destinations ──────────────────────────────────────────────────────────────
export const destinations = {
  list: (activeOnly = true) => request(`/destinations?active_only=${activeOnly}`),
  get: (id) => request(`/destinations/${id}`),
  getBySlug: (slug) => request(`/destinations/slug/${slug}`),
  create: (data) => request("/destinations", { method: "POST", body: data }),
  update: (id, data) => request(`/destinations/${id}`, { method: "PATCH", body: data }),
  delete: (id) => request(`/destinations/${id}`, { method: "DELETE" }),
  uploadImage: (id, file) => uploadFile(`/destinations/${id}/image`, file),
};

// ── Itineraries ───────────────────────────────────────────────────────────────
export const itineraries = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/itineraries${q ? `?${q}` : ""}`);
  },
  get: (id) => request(`/itineraries/${id}`),
  create: (data) => request("/itineraries", { method: "POST", body: data }),
  update: (id, data) => request(`/itineraries/${id}`, { method: "PATCH", body: data }),
  delete: (id) => request(`/itineraries/${id}`, { method: "DELETE" }),
  uploadImage: (id, file) => uploadFile(`/itineraries/${id}/image`, file),
  // Smart route: get options for a specific day/departure
  getOptions: (dayNumber, departsFrom) =>
    request(`/itineraries?day_number=${dayNumber}&departs_from=${departsFrom}`),
};

// ── Hotels ────────────────────────────────────────────────────────────────────
export const hotels = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/hotels${q ? `?${q}` : ""}`);
  },
  get: (id) => request(`/hotels/${id}`),
  listByDestination: (slug) => request(`/hotels?destination_slug=${slug}`),
  create: (data) => request("/hotels", { method: "POST", body: data }),
  update: (id, data) => request(`/hotels/${id}`, { method: "PATCH", body: data }),
  
  // ADD CONSOLE LOGS HERE TO VERIFY FRONTEND EXECUTION:
  delete: (id) => {
    console.log("🟢 API Client executing DELETE hotel with ID:", id);
    return request(`/hotels/${id}`, { method: "DELETE" });
  },
  
  uploadImage: (id, file) => uploadFile(`/hotels/${id}/image`, file),
  addRoomType: (hotelId, data) =>
    request(`/hotels/${hotelId}/room-types`, { method: "POST", body: data }),
  updateRates: (hotelId, roomTypeId, rates) =>
    request(`/hotels/${hotelId}/room-types/${roomTypeId}/rates`, { method: "PATCH", body: rates }),
  deleteRoomType: (hotelId, roomTypeId) =>
    request(`/hotels/${hotelId}/room-types/${roomTypeId}`, { method: "DELETE" }),
};
// ── Vehicles ──────────────────────────────────────────────────────────────────
export const vehicles = {
  list: (activeOnly = true) => request(`/vehicles?active_only=${activeOnly}`),
  get: (id) => request(`/vehicles/${id}`),
  create: (data) => request("/vehicles", { method: "POST", body: data }),
  update: (id, data) => request(`/vehicles/${id}`, { method: "PATCH", body: data }),
  updateSeasonalRates: (id, rates) =>
    request(`/vehicles/${id}/seasonal-rates`, { method: "PATCH", body: rates }),
  delete: (id) => request(`/vehicles/${id}`, { method: "DELETE" }),
  uploadImage: (id, file) => uploadFile(`/vehicles/${id}/image`, file),
};

// ── Activities ────────────────────────────────────────────────────────────────
export const activities = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/activities${q ? `?${q}` : ""}`);
  },
  get: (id) => request(`/activities/${id}`),
  create: (data) => request("/activities", { method: "POST", body: data }),
  update: (id, data) => request(`/activities/${id}`, { method: "PATCH", body: data }),
  delete: (id) => request(`/activities/${id}`, { method: "DELETE" }),
};

// ── Quotations ────────────────────────────────────────────────────────────────
export const quotations = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/quotations${q ? `?${q}` : ""}`);
  },
  get: (id) => request(`/quotations/${id}`),
  create: (data, sendEmail = false) =>
    request(`/quotations?send_email=${sendEmail}`, { method: "POST", body: data }),
  update: (id, data) => request(`/quotations/${id}`, { method: "PATCH", body: data }),
  sendEmail: (id) =>
    request(`/quotations/${id}/send-email`, { method: "POST" }),
  downloadPdf: (id) => `${BASE}/quotations/${id}/pdf`,
  pricePreview: (data) =>
    request("/quotations/price-preview", { method: "POST", body: data }),
  adminStats: () => request("/quotations/admin/stats"),
};

// ── Templates ─────────────────────────────────────────────────────────────────
export const templates = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/templates${q ? `?${q}` : ""}`);
  },
  get: (id) => request(`/templates/${id}`),
  create: (data) => request("/templates", { method: "POST", body: data }),
  use: (id) => request(`/templates/${id}/use`, { method: "POST" }),
  update: (id, data) => request(`/templates/${id}`, { method: "PATCH", body: data }),
  delete: (id) => request(`/templates/${id}`, { method: "DELETE" }),
};

// ── Agents ────────────────────────────────────────────────────────────────────
export const agents = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/agents${q ? `?${q}` : ""}`);
  },
  get: (id) => request(`/agents/${id}`),
  create: (data) => request("/agents", { method: "POST", body: data }),
  update: (id, data) => request(`/agents/${id}`, { method: "PATCH", body: data }),
  approve: (id) => request(`/agents/${id}/approve`, { method: "POST" }),
  suspend: (id) => request(`/agents/${id}/suspend`, { method: "POST" }),
  delete: (id) => request(`/agents/${id}`, { method: "DELETE" }),
};

// ── Pricing ───────────────────────────────────────────────────────────────────
export const pricing = {
  listSeasonal: () => request("/pricing/seasonal"),
  updateSeasonal: (rules) =>
    request("/pricing/seasonal", { method: "PUT", body: rules }),
  patchSeason: (season, rule) =>
    request(`/pricing/seasonal/${season}`, { method: "PATCH", body: rule }),
};

// ── Admin Stats ───────────────────────────────────────────────────────────────
export const adminStats = {
  overview: () => request("/admin/stats/overview"),
  topAgents: (limit = 10) => request(`/admin/stats/top-agents?limit=${limit}`),
  quotationTrends: (days = 30) => request(`/admin/stats/quotation-trends?days=${days}`),
  statusBreakdown: () => request("/admin/stats/status-breakdown"),
};

// ── Default export ─────────────────────────────────────────────────────────────
export default {
  auth, destinations, itineraries, hotels, vehicles, activities,
  quotations, templates, agents, pricing, adminStats, tokenStore,
};