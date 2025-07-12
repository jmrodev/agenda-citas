const { FIELDS } = require('./constants');
const {
  validateQuery,
  initializeSQL,
  addIdFilter,
  addTextSearchFilter,
  addDateFilter
} = require('./helpers');

function buildPersonFilters(query) {
  query = validateQuery(query);
  let { sql, params } = initializeSQL();

  // Filtros de búsqueda exacta
  addIdFilter(sql, params, FIELDS.DNI, query.dni);
  addDateFilter(sql, params, FIELDS.DATE_OF_BIRTH, query.fecha_nacimiento);
  addIdFilter(sql, params, FIELDS.HEALTH_INSURANCE_ID, query.obra_social_id);
  addIdFilter(sql, params, FIELDS.ASSIGNED_DOCTOR_ID, query.assigned_doctor_id);

  // Filtros de búsqueda de texto (LIKE)
  addTextSearchFilter(sql, params, FIELDS.FIRST_NAME, query.nombre);
  addTextSearchFilter(sql, params, FIELDS.LAST_NAME, query.apellido);
  addTextSearchFilter(sql, params, FIELDS.ADDRESS, query.direccion);
  addTextSearchFilter(sql, params, FIELDS.PHONE, query.telefono);
  addTextSearchFilter(sql, params, FIELDS.EMAIL, query.email);
  addTextSearchFilter(sql, params, FIELDS.PREFERRED_PAYMENT_METHODS, query.metodo_pago);

  // NOTA: Los campos de referencia ya no están en la tabla patients
  // Se manejan a través de la tabla patient_references
  // Los filtros de referencia se deben hacer en el servicio con JOINs

  return { sql, params };
}

module.exports = { buildPersonFilters }; 