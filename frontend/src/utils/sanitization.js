/**
 * Utilidades de sanitización de datos
 */

/**
 * Sanitiza texto removiendo caracteres peligrosos
 * @param {string} text - Texto a sanitizar
 * @returns {string} - Texto sanitizado
 */
export const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .trim()
    .replace(/[<>]/g, '') // Remover < y >
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+=/gi, '') // Remover event handlers
    .replace(/\s+/g, ' '); // Normalizar espacios
};

/**
 * Sanitiza email
 * @param {string} email - Email a sanitizar
 * @returns {string} - Email sanitizado
 */
export const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') return '';
  
  return email
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '') // Remover espacios
    .replace(/[<>]/g, ''); // Remover < y >
};

/**
 * Sanitiza teléfono
 * @param {string} phone - Teléfono a sanitizar
 * @returns {string} - Teléfono sanitizado
 */
export const sanitizePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return '';
  
  return phone
    .trim()
    .replace(/[^\d\s\-\+\(\)]/g, '') // Solo números, espacios, guiones, paréntesis y +
    .replace(/\s+/g, ' '); // Normalizar espacios
};

/**
 * Sanitiza DNI
 * @param {string} dni - DNI a sanitizar
 * @returns {string} - DNI sanitizado
 */
export const sanitizeDNI = (dni) => {
  if (!dni || typeof dni !== 'string') return '';
  
  return dni
    .trim()
    .replace(/[^\d]/g, ''); // Solo números
};

/**
 * Sanitiza CUIT
 * @param {string} cuit - CUIT a sanitizar
 * @returns {string} - CUIT sanitizado
 */
export const sanitizeCUIT = (cuit) => {
  if (!cuit || typeof cuit !== 'string') return '';
  
  return cuit
    .trim()
    .replace(/[^\d\-]/g, '') // Solo números y guiones
    .replace(/-+/g, '-'); // Normalizar guiones
};

/**
 * Sanitiza fecha
 * @param {string} date - Fecha a sanitizar
 * @returns {string} - Fecha sanitizada
 */
export const sanitizeDate = (date) => {
  if (!date || typeof date !== 'string') return '';
  
  return date
    .trim()
    .replace(/[^\d\-]/g, '') // Solo números y guiones
    .replace(/-+/g, '-'); // Normalizar guiones
};

/**
 * Sanitiza hora
 * @param {string} time - Hora a sanitizar
 * @returns {string} - Hora sanitizada
 */
export const sanitizeTime = (time) => {
  if (!time || typeof time !== 'string') return '';
  
  return time
    .trim()
    .replace(/[^\d:]/g, '') // Solo números y dos puntos
    .replace(/:+/, ':'); // Normalizar dos puntos
};

/**
 * Sanitiza URL
 * @param {string} url - URL a sanitizar
 * @returns {string} - URL sanitizada
 */
export const sanitizeURL = (url) => {
  if (!url || typeof url !== 'string') return '';
  
  return url
    .trim()
    .replace(/[<>]/g, '') // Remover < y >
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+=/gi, ''); // Remover event handlers
};

/**
 * Sanitiza número
 * @param {string|number} number - Número a sanitizar
 * @returns {number} - Número sanitizado
 */
export const sanitizeNumber = (number) => {
  if (number === null || number === undefined) return 0;
  
  const num = Number(number);
  return isNaN(num) ? 0 : num;
};

/**
 * Sanitiza objeto completo
 * @param {Object} obj - Objeto a sanitizar
 * @param {Object} rules - Reglas de sanitización por campo
 * @returns {Object} - Objeto sanitizado
 */
export const sanitizeObject = (obj, rules = {}) => {
  if (!obj || typeof obj !== 'object') return {};
  
  const sanitized = {};
  
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    const rule = rules[key] || 'text'; // Por defecto sanitizar como texto
    
    switch (rule) {
      case 'email':
        sanitized[key] = sanitizeEmail(value);
        break;
      case 'phone':
        sanitized[key] = sanitizePhone(value);
        break;
      case 'dni':
        sanitized[key] = sanitizeDNI(value);
        break;
      case 'cuit':
        sanitized[key] = sanitizeCUIT(value);
        break;
      case 'date':
        sanitized[key] = sanitizeDate(value);
        break;
      case 'time':
        sanitized[key] = sanitizeTime(value);
        break;
      case 'url':
        sanitized[key] = sanitizeURL(value);
        break;
      case 'number':
        sanitized[key] = sanitizeNumber(value);
        break;
      case 'text':
      default:
        sanitized[key] = sanitizeText(value);
        break;
    }
  });
  
  return sanitized;
};

/**
 * Sanitiza formulario completo
 * @param {Object} formData - Datos del formulario
 * @param {Object} schema - Esquema de sanitización
 * @returns {Object} - Formulario sanitizado
 */
export const sanitizeForm = (formData, schema) => {
  return sanitizeObject(formData, schema);
};

/**
 * Esquemas de sanitización predefinidos
 */
export const SANITIZATION_SCHEMAS = {
  LOGIN: {
    username: 'text',
    password: 'text'
  },

  REGISTER: {
    first_name: 'text',
    last_name: 'text',
    email: 'email',
    password: 'text',
    confirm_password: 'text'
  },

  PATIENT: {
    first_name: 'text',
    last_name: 'text',
    email: 'email',
    phone: 'phone',
    dni: 'dni',
    date_of_birth: 'date',
    address: 'text',
    notes: 'text'
  },

  APPOINTMENT: {
    patient_id: 'number',
    doctor_id: 'number',
    date: 'date',
    time: 'time',
    notes: 'text'
  },

  DOCTOR: {
    first_name: 'text',
    last_name: 'text',
    email: 'email',
    phone: 'phone',
    specialty: 'text',
    license_number: 'text'
  }
};

/**
 * Sanitiza datos antes de enviar al servidor
 * @param {Object} data - Datos a enviar
 * @param {string} endpoint - Endpoint para determinar esquema
 * @returns {Object} - Datos sanitizados
 */
export const sanitizeForAPI = (data, endpoint) => {
  let schema = {};
  
  // Determinar esquema basado en el endpoint
  if (endpoint.includes('auth/login')) {
    schema = SANITIZATION_SCHEMAS.LOGIN;
  } else if (endpoint.includes('auth/register')) {
    schema = SANITIZATION_SCHEMAS.REGISTER;
  } else if (endpoint.includes('patients')) {
    schema = SANITIZATION_SCHEMAS.PATIENT;
  } else if (endpoint.includes('appointments')) {
    schema = SANITIZATION_SCHEMAS.APPOINTMENT;
  } else if (endpoint.includes('doctors')) {
    schema = SANITIZATION_SCHEMAS.DOCTOR;
  }
  
  return sanitizeForm(data, schema);
}; 