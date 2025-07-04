import { getToken, isTokenValid } from './session';
import { refreshAccessToken, logout } from './authService';

export async function authFetch(url, options = {}) {
  let token = getToken();
  let headers = options.headers ? { ...options.headers } : {};
  if (token && isTokenValid(token)) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  let response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    // Intenta renovar el token
    try {
      const newToken = await refreshAccessToken();
      headers['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(url, { ...options, headers });
    } catch {
      logout();
      return;
    }
  }
  return response;
} 