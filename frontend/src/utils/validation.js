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
    password: ['required', (value) => value.length >= 6 ? null : 'Mínimo 6 caracteres']
  },

  REGISTER: {
    first_name: ['required', 'onlyLetters', (value) => value.length >= 2 ? null : 'Mínimo 2 caracteres'],
    last_name: ['required', 'onlyLetters', (value) => value.length >= 2 ? null : 'Mínimo 2 caracteres'],
    email: ['required', 'email'],
    password: ['required', 'password'],
    confirm_password: ['required', (value, password) => 
      value === password ? null : 'Las contraseñas no coinciden'
    ],
    username: ['required', { type: 'minLength', params: [3] }, { type: 'maxLength', params: [20] }, (value) => PATTERNS.ALPHANUMERIC.test(value.replace(/_/g, '')) ? null : 'Solo letras, números y guion bajo'], // Permitir guion bajo pero validar el resto como alfanumérico
    role: ['required'] // 'admin', 'doctor', 'secretary', 'patient'
  },

  DOCTOR: {
    first_name: ['required', 'onlyLetters', { type: 'minLength', params: [2] }],
    last_name: ['required', 'onlyLetters', { type: 'minLength', params: [2] }],
    specialty: ['required', { type: 'maxLength', params: [100] }],
    license_number: ['required', { type: 'maxLength', params: [50] }],
    phone: ['phone'], // Opcional por defecto, si es requerido añadir 'required'
    email: ['required', 'email'],
    consultation_fee: ['required', { type: 'minValue', params: [0.01] }],
    prescription_fee: ['required', { type: 'minValue', params: [0.01] }]
    // last_earnings_collection_date: ['date'] // Si se maneja en el form
  },

  SECRETARY: {
    first_name: ['required', 'onlyLetters', { type: 'minLength', params: [2] }],
    last_name: ['required', 'onlyLetters', { type: 'minLength', params: [2] }],
    email: ['required', 'email'],
    phone: ['required', 'phone'], // Asumiendo que es requerido para secretarias
    username: ['required', { type: 'minLength', params: [3] }, { type: 'maxLength', params: [20] }, (value) => PATTERNS.ALPHANUMERIC.test(value.replace(/_/g, '')) ? null : 'Solo letras, números y guion bajo'], // Solo para creación
    shift: [], // Opcional, o ['required'] si lo es
    entry_time: ['time'], // Opcional, o ['required'] si lo es
    exit_time: ['time', (value, entryTime) => { // Validación custom para asegurar que exit_time > entry_time
        if (!value || !entryTime) return null;
        return value > entryTime ? null : 'La hora de salida debe ser posterior a la de entrada';
    }]
  },

  PATIENT: {
    first_name: ['required', 'onlyLetters', (value) => value && value.length >= 2 ? null : 'Mínimo 2 caracteres'],
    last_name: ['required', 'onlyLetters', (value) => value && value.length >= 2 ? null : 'Mínimo 2 caracteres'],
    email: ['email'],
    phone: ['phone'],
    dni: ['required', 'dni'],
    date_of_birth: ['required', 'date'],
    address: [(value) => !value || value.length <= 255 ? null : 'Máximo 255 caracteres'],
    preferred_payment_methods: [(value) => {
      if (!value || value.trim() === '') return 'Debe seleccionar al menos un método de pago';
      const methods = value.split(',').filter(m => m.trim());
      if (methods.length === 0) return 'Debe seleccionar al menos un método de pago';
      return null;
    }],
    health_insurance_id: [(value) => !value || !isNaN(value) ? null : 'ID de obra social inválido'],
    health_insurance_member_number: [(value) => !value || value.length <= 50 ? null : 'Máximo 50 caracteres'],
    doctor_ids: [(value) => !value || Array.isArray(value) ? null : 'Debe ser un array de IDs de doctores'],
    reference_person: [(value) => {
      if (!value) return null;
      if (typeof value !== 'object') return 'Debe ser un objeto';
      if (value.name && !PATTERNS.ONLY_LETTERS.test(value.name)) return 'Nombre de referencia solo puede contener letras';
      if (value.last_name && !PATTERNS.ONLY_LETTERS.test(value.last_name)) return 'Apellido de referencia solo puede contener letras';
      if (value.phone && !PATTERNS.PHONE.test(value.phone)) return 'Teléfono de referencia inválido';
      return null;
    }]
  },

  APPOINTMENT: {
    patient_id: ['required'],
    doctor_id: ['required'], // En el modal, doctor_id viene de `selectedDoctorId`, no es un campo de form directo. El hook useForm lo manejará si se pasa en initialValues.
    date: ['required', 'date'],
    time: ['required', 'time'],
    reason: ['required', { type: 'maxLength', params: [255] }],
    type: [], // Opcional, o ['required']
    status: [], // Opcional, o ['required']
    service_type: [{ type: 'maxLength', params: [100] }], // Opcional
    amount: ['required', { type: 'minValue', params: [0.01] }],
    payment_method: [], // Opcional, o ['required']
    notes: [{ type: 'maxLength', params: [500] }] // Opcional
  }
}; 