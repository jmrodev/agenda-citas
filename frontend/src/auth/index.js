// Archivo de índice para centralizar todas las exportaciones de autenticación

// Servicios principales
export { login, refreshAccessToken, logout } from './authService.js';
export { fetchUserProfile, updateUserProfile } from './userService.js';

// Funciones de sesión
export {
  getToken,
  setToken,
  clearToken,
  getRole,
  setRole,
  clearRole,
  getRefreshToken,
  setRefreshToken,
  clearRefreshToken,
  setSession,
  clearSession,
  isTokenValid
} from './session.js';

// Utilidades
export { decodeToken, isTokenExpired, handleAuthResponse } from './authUtils.js';

// Constantes y helpers
export { ROLES, isAllowedRole } from './roles.js';

// Fetch con autenticación
export { authFetch } from './authFetch.js'; 