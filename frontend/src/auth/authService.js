import { setSession, clearSession, getRefreshToken, setRefreshToken, clearRefreshToken } from './session.js';

export async function login({ username, password }) {
  console.log('authService.login - Datos a enviar:', { username, password });
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  console.log('authService.login - Status:', res.status, res.statusText);
  if (!res.ok) {
    const data = await res.json();
    console.log('authService.login - Error response:', data);
    throw new Error(data.message || 'Credenciales incorrectas');
  }
  const data = await res.json();
  console.log('authService.login - Success response:', data);
  setSession(data.token, data.user.role);
  if (data.refresh_token) {
    setRefreshToken(data.refresh_token);
  }
  return data;
}

export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No hay refresh token');
  const res = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken })
  });
  if (!res.ok) {
    clearSession();
    clearRefreshToken();
    throw new Error('No se pudo renovar el token');
  }
  const data = await res.json();
  setSession(data.token, data.user.role);
  if (data.refresh_token) setRefreshToken(data.refresh_token);
  return data.token;
}

export function logout() {
  clearSession();
  clearRefreshToken();
  window.location.href = '/login';
} 