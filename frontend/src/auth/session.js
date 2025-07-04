// Manejo de sesión y token JWT

export function getToken() {
  return localStorage.getItem('token');
}

export function getRole() {
  return localStorage.getItem('role');
}

export function setSession(token, role) {
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
}

export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
}

export function isTokenValid(token) {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return !payload.exp || (payload.exp * 1000) > Date.now();
  } catch {
    return false;
  }
}

export function getRefreshToken() {
  return localStorage.getItem('refresh_token');
}

export function setRefreshToken(token) {
  localStorage.setItem('refresh_token', token);
}

export function clearRefreshToken() {
  localStorage.removeItem('refresh_token');
} 