import { setSession, clearSession, getRefreshToken, setRefreshToken, clearRefreshToken, setToken, setRole } from './session.js';
import { handleAuthResponse } from './authUtils.js';

export async function login({ username, password }) {
  console.log('authService.login - Iniciando login para usuario:', username);
  
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    console.log('authService.login - Status:', res.status, res.statusText);
    
    const data = await handleAuthResponse(res);
    console.log('authService.login - Login exitoso:', { user_id: data.user.user_id, role: data.user.role });
    
    // Guardar token y rol en localStorage
    setToken(data.token);
    setRole(data.user.role);
    if (data.refresh_token) {
      setRefreshToken(data.refresh_token);
    }
    
    return data;
  } catch (error) {
    console.error('authService.login - Error:', error.message);
    throw error;
  }
}

export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No hay refresh token disponible');
  }
  
  const res = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken })
  });
  
  if (!res.ok) {
    clearSession();
    clearRefreshToken();
    throw new Error('No se pudo renovar el token de acceso');
  }
  
  const data = await handleAuthResponse(res);
  // Guardar token y rol en localStorage
  setToken(data.token);
  setRole(data.user.role);
  if (data.refresh_token) {
    setRefreshToken(data.refresh_token);
  }
  
  return data.token;
}

export function logout() {
  clearSession();
  clearRefreshToken();
  window.location.href = '/login';
} 