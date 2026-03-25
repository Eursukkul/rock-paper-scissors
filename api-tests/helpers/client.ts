const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

export const API_URL = `${BASE_URL}/api`;

export async function get(path: string): Promise<Response> {
  const url = `${API_URL}${path}`;
  const res = await fetch(url);
  return res;
}

export async function post(path: string, body: object): Promise<Response> {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res;
}
