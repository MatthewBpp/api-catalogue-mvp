const API_BASE_URL = 'http://localhost:4000'; // change if your backend uses another port

export function getUserNumber(): string | null {
  return localStorage.getItem('userNumber');
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const userNumber = getUserNumber();

  const headers = new Headers(options.headers || {});
  if (userNumber) {
    headers.set('x-user-number', userNumber);
  }
  headers.set('Content-Type', 'application/json');

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  return res.json().catch(() => null);
}
