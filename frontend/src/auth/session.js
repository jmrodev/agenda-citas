import { isTokenExpired } from './authUtils.js';

// Manejo de sesión y token JWT

// Funciones para token de acceso
export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  localStorage.setItem('token', token);
}

export function clearToken() {
  localStorage.removeItem('token');
}

// Funciones para rol de usuario
export function getRole() {
  return localStorage.getItem('role');
}

export function setRole(role) {
  localStorage.setItem('role', role);
}

export function clearRole() {
  localStorage.removeItem('role');
}

// Funciones para refresh token
export function getRefreshToken() {
  return localStorage.getItem('refresh_token');
}

export function setRefreshToken(token) {
  localStorage.setItem('refresh_token', token);
}

export function clearRefreshToken() {
  localStorage.removeItem('refresh_token');
}

// Funciones de conveniencia para sesión completa
export function setSession(token, role) {
  setToken(token);
  setRole(role);
}

export function clearSession() {
  clearToken();
  clearRole();
}

// Función de conveniencia que usa isTokenExpired de authUtils
export function isTokenValid(token) {
  if (!token) return false;
  return !isTokenExpired(token);
} 