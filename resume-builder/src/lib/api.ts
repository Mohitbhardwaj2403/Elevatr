const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:8000/api/v1";

export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

function getToken(): string | null {
  return localStorage.getItem("token");
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (options.auth) {
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const resp = await fetch(url, { ...options, headers });
  const contentType = resp.headers.get("content-type") || "";

  let data: unknown = null;
  if (contentType.includes("application/json")) {
    data = await resp.json();
  } else {
    data = await resp.text();
  }

  if (!resp.ok) {
    const message =
      typeof (data as any)?.detail === "string"
        ? (data as any).detail
        : `Request failed (${resp.status})`;
    const err: ApiError = { status: resp.status, message, details: data };
    throw err;
  }

  return data as T;
}

export function setAuthToken(token: string | null) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

