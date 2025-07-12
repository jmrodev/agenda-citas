const { FIELDS } = require('./constants');
const {
  validateQuery,
  initializeSQL,
  addIdFilter,
  addTextSearchFilter
} = require('./helpers');

function buildReferencePersonFilters(query) {
  query = validateQuery(query);
  let { sql, params } = initializeSQL();

  // Filtros de IDs
  addIdFilter(sql, params, FIELDS.PATIENT_ID, query.paciente_id);
  addIdFilter(sql, params, FIELDS.DNI, query.dni);

  // Filtros de búsqueda de texto (LIKE)
  addTextSearchFilter(sql, params, FIELDS.FIRST_NAME, query.nombre);
  addTextSearchFilter(sql, params, FIELDS.LAST_NAME, query.apellido);
  addTextSearchFilter(sql, params, FIELDS.PHONE, query.telefono);
  addTextSearchFilter(sql, params, FIELDS.ADDRESS, query.direccion);
  addTextSearchFilter(sql, params, FIELDS.RELATIONSHIP, query.parentesco);

  return { sql, params };
}

module.exports = { buildReferencePersonFilters }; 