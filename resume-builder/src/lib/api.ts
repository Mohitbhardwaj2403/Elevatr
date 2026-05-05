const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:8000/api/v1";

export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

function formatBackendDetail(data: unknown): string | null {
  const detail = (data as { detail?: unknown })?.detail;
  if (detail == null) return null;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const parts = detail
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "msg" in item) {
          const loc = Array.isArray((item as { loc?: unknown }).loc)
            ? ((item as { loc: unknown[] }).loc as unknown[])
                .filter((x) => x !== "body")
                .join(".")
            : "";
          const msg = String((item as { msg?: unknown }).msg ?? "");
          return loc ? `${loc}: ${msg}` : msg;
        }
        return "";
      })
      .filter(Boolean);
    return parts.length ? parts.join("; ") : null;
  }
  if (typeof detail === "object") {
    try {
      return JSON.stringify(detail);
    } catch {
      return String(detail);
    }
  }
  return String(detail);
}

function getToken(): string | null {
  return localStorage.getItem("token");
}

export function isApiError(err: unknown): err is ApiError {
  return Boolean(err && typeof err === "object" && "status" in err && "message" in err);
}

export function getApiErrorMessage(err: unknown, fallback: string): string {
  const baseHint = `API: ${API_BASE_URL}`;
  if (err instanceof TypeError && err.message.toLowerCase().includes("fetch")) {
    return `Cannot reach the backend API (${baseHint}). Is uvicorn running on port 8000? If you open the app via 127.0.0.1, add that origin to backend CORS_ORIGINS.`;
  }
  if (isApiError(err)) {
    const core = err.message?.trim() || fallback;
    return err.status ? `${core} (${baseHint}, HTTP ${err.status})` : `${core} (${baseHint})`;
  }
  if (err instanceof Error) {
    const cause = (err as Error & { cause?: unknown }).cause;
    if (cause && isApiError(cause)) {
      const prefix = err.message?.trim() ? `${err.message.trim()} — ` : "";
      const core = cause.message?.trim() || fallback;
      const suffix = cause.status ? ` (${baseHint}, HTTP ${cause.status})` : ` (${baseHint})`;
      return `${prefix}${core}${suffix}`;
    }
    const msg = err.message?.trim();
    return msg ? `${msg} (${baseHint})` : `${fallback} (${baseHint})`;
  }
  return `${fallback} (${baseHint})`;
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

  let resp: Response;
  try {
    resp = await fetch(url, { ...options, headers });
  } catch (e) {
    const msg =
      e instanceof TypeError
        ? "Network error — cannot reach API (check backend URL / CORS)."
        : "Network error — cannot reach API.";
    throw { status: 0, message: msg, details: e } satisfies ApiError;
  }
  const contentType = resp.headers.get("content-type") || "";

  let data: unknown = null;
  if (contentType.includes("application/json")) {
    try {
      data = await resp.json();
    } catch {
      data = await resp.text();
    }
  } else {
    data = await resp.text();
  }

  if (!resp.ok) {
    const fromDetail = formatBackendDetail(data);
    const message = fromDetail || `Request failed (${resp.status})`;
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

