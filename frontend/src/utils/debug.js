/**
 * Utilidad de debug que solo muestra logs en desarrollo
 * En producción, todas las funciones son no-ops
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const debug = {
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  error: (...args) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },
  
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  
  group: (...args) => {
    if (isDevelopment) {
      console.group(...args);
    }
  },
  
  groupEnd: () => {
    if (isDevelopment) {
      console.groupEnd();
    }
  },
  
  table: (...args) => {
    if (isDevelopment) {
      console.table(...args);
    }
  }
};

// Función helper para crear logs con contexto
export const createLogger = (context) => ({
  log: (...args) => debug.log(`[${context}]`, ...args),
  error: (...args) => debug.error(`[${context}]`, ...args),
  warn: (...args) => debug.warn(`[${context}]`, ...args),
  info: (...args) => debug.info(`[${context}]`, ...args),
  group: (...args) => debug.group(`[${context}]`, ...args),
  groupEnd: debug.groupEnd,
  table: debug.table
});

// Función para medir performance (solo en desarrollo)
export const measureTime = (label, fn) => {
  if (isDevelopment) {
    console.time(label);
    const result = fn();
    console.timeEnd(label);
    return result;
  }
  return fn();
};

// Función para crear logs condicionales
export const logIf = (condition, ...args) => {
  if (isDevelopment && condition) {
    console.log(...args);
  }
};

export const debugApp = debug('frontend:app');
export const debugPatients = debug('frontend:patients');
export const debugAuth = debug('frontend:auth');
export const debugCalendar = debug('frontend:calendar');
export const debugDashboard = debug('frontend:dashboard');
export const debugPayments = debug('frontend:payments'); 