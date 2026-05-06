const API_BASE_URL = "https://ideal-funicular-4j46rqqgv7rj2wwq-4000.app.github.dev";

export function getUserNumber(): string {
  // Always return a value so the backend never rejects the request
  return localStorage.getItem('userNumber') || "dev-user-123";
}

export class ApiError extends Error {
  status: number;
  details?: string;

  constructor(status: number, message: string, details?: string) {
    super(message);
    this.status = status;
    this.details = details;
    this.name = 'ApiError';
  }
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const userNumber = getUserNumber();

  const headers = new Headers(options.headers || {});
  headers.set('x-user-number', userNumber);
  headers.set('Content-Type', 'application/json');

  // Force Safari to send a preflight so Codespaces won't strip headers
  headers.set('X-Custom-Preflight', 'true');

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const body = await res.text();
  let json: any = null;

  if (body) {
    try {
      json = JSON.parse(body);
    } catch {
      json = null;
    }
  }

  if (!res.ok) {
    const message = json?.error || `Request failed with status ${res.status}`;
    const details = json?.details;
    throw new ApiError(res.status, message, details);
  }

  return json;
}

export async function validateUserNumber(userNumber: string) {
  const headers = new Headers({
    'x-user-number': userNumber,
    'Content-Type': 'application/json',
    'X-Custom-Preflight': 'true'
  });

  const res = await fetch(`${API_BASE_URL}/auth/validate`, {
    method: 'GET',
    headers,
  });

  const body = await res.text();
  let json: any = null;

  if (body) {
    try {
      json = JSON.parse(body);
    } catch {
      json = null;
    }
  }

  if (!res.ok) {
    const message = json?.error || `Request failed with status ${res.status}`;
    throw new ApiError(res.status, message, json?.details);
  }

  return json;
}



