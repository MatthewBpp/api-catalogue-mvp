const API_BASE_URL = "https://ideal-funicular-4j46rqqgv7rj2wwq-4000.app.github.dev";

export function getUserNumber(): string {
  // Always return a value so the backend never rejects the request
  return localStorage.getItem('userNumber') || "dev-user-123";
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

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  return res.json().catch(() => null);
}



