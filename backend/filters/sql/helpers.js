const { FIELDS, OPERATORS, SEARCH_PATTERNS } = require('./constants');

// ===== FUNCIONES HELPER PARA FILTROS SQL =====

/**
 * Agrega una condición WHERE si el valor existe
 * @param {string} sql - SQL actual
 * @param {Array} params - Parámetros actuales
 * @param {string} field - Campo a filtrar
 * @param {any} value - Valor del filtro
 * @param {string} operator - Operador SQL (default: '=')
 * @param {Function} pattern - Función de patrón para LIKE (default: EXACT)
 * @returns {Object} { sql, params }
 */
function addFilterCondition(sql, params, field, value, operator = OPERATORS.EQUALS, pattern = SEARCH_PATTERNS.EXACT) {
  if (value !== undefined && value !== null && value !== '') {
    if (operator === OPERATORS.LIKE) {
      sql += ` AND ${field} LIKE ?`;
      params.push(pattern(value));
    } else if (operator === OPERATORS.IN && Array.isArray(value)) {
      if (value.length > 0) {
        const placeholders = value.map(() => '?').join(',');
        sql += ` AND ${field} IN (${placeholders})`;
        params.push(...value);
      }
    } else {
      sql += ` AND ${field} ${operator} ?`;
      params.push(value);
    }
  }
  return { sql, params };
}

/**
 * Agrega filtro de fecha exacta
 */
function addDateFilter(sql, params, field, date) {
  return addFilterCondition(sql, params, field, date);
}

/**
 * Agrega filtro de rango de fechas
 */
function addDateRangeFilter(sql, params, field, dateFrom, dateTo) {
  if (dateFrom) {
    sql += ` AND ${field} >= ?`;
    params.push(dateFrom);
  }
  if (dateTo) {
    sql += ` AND ${field} <= ?`;
    params.push(dateTo);
  }
  return { sql, params };
}

/**
 * Agrega filtro de búsqueda de texto (LIKE)
 */
function addTextSearchFilter(sql, params, field, searchTerm) {
  return addFilterCondition(sql, params, field, searchTerm, OPERATORS.LIKE, SEARCH_PATTERNS.CONTAINS);
}

/**
 * Agrega filtro de ID
 */
function addIdFilter(sql, params, field, id) {
  return addFilterCondition(sql, params, field, id);
}

/**
 * Agrega filtro de estado con soporte para array
 */
function addStatusFilter(sql, params, field, status) {
  if (status !== undefined && status !== null && status !== '') {
    if (Array.isArray(status)) {
      if (status.length > 0) {
        const placeholders = status.map(() => '?').join(',');
        sql += ` AND ${field} IN (${placeholders})`;
        params.push(...status);
      }
    } else {
      sql += ` AND ${field} = ?`;
      params.push(status);
    }
  }
  return { sql, params };
}

/**
 * Valida que el query sea un objeto
 */
function validateQuery(query) {
  if (!query || typeof query !== 'object') {
    throw new Error('Query debe ser un objeto válido');
  }
  return query;
}

/**
 * Inicializa el SQL base con WHERE 1=1
 */
function initializeSQL() {
  return {
    sql: 'WHERE 1=1',
    params: []
  };
}

module.exports = {
  addFilterCondition,
  addDateFilter,
  addDateRangeFilter,
  addTextSearchFilter,
  addIdFilter,
  addStatusFilter,
  validateQuery,
  initializeSQL
}; 