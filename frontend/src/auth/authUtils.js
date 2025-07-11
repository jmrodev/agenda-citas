// Utilidades comunes para autenticación

/**
 * Decodifica un token JWT y retorna su payload
 * @param {string} token - Token JWT
 * @returns {object|null} Payload del token o null si es inválido
 */
export function decodeToken(token) {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Error decodificando token:', error);
    return null;
  }
}

/**
 * Verifica si un token está expirado
 * @param {string} token - Token JWT
 * @returns {boolean} true si está expirado, false si es válido
 */
export function isTokenExpired(token) {
  const payload = decodeToken(token);
  if (!payload) return true;
  
  return payload.exp && (payload.exp * 1000) <= Date.now();
}

/**
 * Maneja errores de autenticación de forma consistente
 * @param {Response} response - Respuesta del fetch
 * @returns {Promise<object>} Datos de la respuesta
 * @throws {Error} Error con mensaje descriptivo
 */
export async function handleAuthResponse(response) {
  if (!response.ok) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    
    try {
      const data = await response.json();
      errorMessage = data.error || data.message || errorMessage;
    } catch (parseError) {
      // Si no se puede parsear JSON, usar el mensaje por defecto
      console.warn('No se pudo parsear respuesta de error:', parseError);
    }
    
    throw new Error(errorMessage);
  }
  
  return await response.json();
} 