/**
 * Sistema de validación robusto para formularios
 */

// Patrones de validación
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[0-9\s\-\(\)]{7,15}$/,
  DNI: /^[0-9]{7,8}$/,
  CUIT: /^[0-9]{2}-[0-9]{8}-[0-9]$/,
  DATE: /^\d{4}-\d{2}-\d{2}$/,
  TIME: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
  ALPHANUMERIC: /^[a-zA-Z0-9\s]+$/,
  ONLY_LETTERS: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  ONLY_NUMBERS: /^[0-9]+$/,
  URL: /^https?:\/\/.+/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
};

// Mensajes de error personalizados
export const ERROR_MESSAGES = {
  REQUIRED: 'Este campo es obligatorio',
  EMAIL: 'Ingrese un email válido',
  PHONE: 'Ingrese un teléfono válido',
  DNI: 'Ingrese un DNI válido (7-8 dígitos)',
  CUIT: 'Ingrese un CUIT válido (XX-XXXXXXXX-X)',
  DATE: 'Ingrese una fecha válida',
  TIME: 'Ingrese una hora válida',
  MIN_LENGTH: (min) => `Mínimo ${min} caracteres`,
  MAX_LENGTH: (max) => `Máximo ${max} caracteres`,
  MIN_VALUE: (min) => `Valor mínimo: ${min}`,
  MAX_VALUE: (max) => `Valor máximo: ${max}`,
  PASSWORD: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número',
  ALPHANUMERIC: 'Solo se permiten letras y números',
  ONLY_LETTERS: 'Solo se permiten letras',
  ONLY_NUMBERS: 'Solo se permiten números',
  URL: 'Ingrese una URL válida',
  CUSTOM: (message) => message
};

// Validadores individuales
export const validators = {
  required: (value) => {
    if (value === null || value === undefined) return ERROR_MESSAGES.REQUIRED;
    if (typeof value === 'string' && value.trim() === '') return ERROR_MESSAGES.REQUIRED;
    if (Array.isArray(value) && value.length === 0) return ERROR_MESSAGES.REQUIRED;
    return null;
  },

  email: (value) => {
    if (!value) return null; // Si no es requerido, no validar
    return PATTERNS.EMAIL.test(value) ? null : ERROR_MESSAGES.EMAIL;
  },

  phone: (value) => {
    if (!value) return null;
    return PATTERNS.PHONE.test(value) ? null : ERROR_MESSAGES.PHONE;
  },

  dni: (value) => {
    if (!value) return null;
    return PATTERNS.DNI.test(value) ? null : ERROR_MESSAGES.DNI;
  },

  cuit: (value) => {
    if (!value) return null;
    return PATTERNS.CUIT.test(value) ? null : ERROR_MESSAGES.CUIT;
  },

  date: (value) => {
    if (!value) return null;
    if (!PATTERNS.DATE.test(value)) return ERROR_MESSAGES.DATE;
    const date = new Date(value);
    return isNaN(date.getTime()) ? ERROR_MESSAGES.DATE : null;
  },

  time: (value) => {
    if (!value) return null;
    return PATTERNS.TIME.test(value) ? null : ERROR_MESSAGES.TIME;
  },

  minLength: (min) => (value) => {
    if (!value) return null;
    return value.length >= min ? null : ERROR_MESSAGES.MIN_LENGTH(min);
  },

  maxLength: (max) => (value) => {
    if (!value) return null;
    return value.length <= max ? null : ERROR_MESSAGES.MAX_LENGTH(max);
  },

  minValue: (min) => (value) => {
    if (!value) return null;
    const num = Number(value);
    return num >= min ? null : ERROR_MESSAGES.MIN_VALUE(min);
  },

  maxValue: (max) => (value) => {
    if (!value) return null;
    const num = Number(value);
    return num <= max ? null : ERROR_MESSAGES.MAX_VALUE(max);
  },

  password: (value) => {
    if (!value) return null;
    return PATTERNS.PASSWORD.test(value) ? null : ERROR_MESSAGES.PASSWORD;
  },

  alphanumeric: (value) => {
    if (!value) return null;
    return PATTERNS.ALPHANUMERIC.test(value) ? null : ERROR_MESSAGES.ALPHANUMERIC;
  },

  onlyLetters: (value) => {
    if (!value) return null;
    return PATTERNS.ONLY_LETTERS.test(value) ? null : ERROR_MESSAGES.ONLY_LETTERS;
  },

  onlyNumbers: (value) => {
    if (!value) return null;
    return PATTERNS.ONLY_NUMBERS.test(value) ? null : ERROR_MESSAGES.ONLY_NUMBERS;
  },

  url: (value) => {
    if (!value) return null;
    return PATTERNS.URL.test(value) ? null : ERROR_MESSAGES.URL;
  },

  custom: (validator) => (value) => {
    return validator(value);
  }
};

/**
 * Función principal de validación
 * @param {Object} values - Valores a validar
 * @param {Object} rules - Reglas de validación
 * @returns {Object} - Errores encontrados
 */
export const validate = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field];
    const value = values[field];

    for (const rule of fieldRules) {
      let validator;
      let params = [];

      if (typeof rule === 'string') {
        validator = validators[rule];
      } else if (typeof rule === 'function') {
        validator = rule;
      } else if (rule.type) {
        validator = validators[rule.type];
        params = rule.params || [];
      }

      if (validator) {
        const error = validator(value, ...params);
        if (error) {
          errors[field] = error;
          break; // Solo mostrar el primer error por campo
        }
      }
    }
  });

  return errors;
};

/**
 * Validación en tiempo real
 * @param {string} value - Valor a validar
 * @param {Array} rules - Reglas de validación
 * @returns {string|null} - Error o null si es válido
 */
export const validateField = (value, rules) => {
  for (const rule of rules) {
    let validator;
    let params = [];

    if (typeof rule === 'string') {
      validator = validators[rule];
    } else if (typeof rule === 'function') {
      validator = rule;
    } else if (rule.type) {
      validator = validators[rule.type];
      params = rule.params || [];
    }

    if (validator) {
      const error = validator(value, ...params);
      if (error) return error;
    }
  }

  return null;
};

/**
 * Esquemas de validación predefinidos
 */
export const SCHEMAS = {
  LOGIN: {
    username: ['required'],
    password: ['required', 'minLength:6']
  },

  REGISTER: {
    first_name: ['required', 'onlyLetters', 'minLength:2'],
    last_name: ['required', 'onlyLetters', 'minLength:2'],
    email: ['required', 'email'],
    password: ['required', 'password'],
    confirm_password: ['required', (value, password) => 
      value === password ? null : 'Las contraseñas no coinciden'
    ]
  },

  PATIENT: {
    first_name: ['required', 'onlyLetters', 'minLength:2'],
    last_name: ['required', 'onlyLetters', 'minLength:2'],
    email: ['email'],
    phone: ['phone'],
    dni: ['dni'],
    date_of_birth: ['date']
  },

  APPOINTMENT: {
    patient_id: ['required'],
    doctor_id: ['required'],
    date: ['required', 'date'],
    time: ['required', 'time'],
    notes: ['maxLength:500']
  }
}; 