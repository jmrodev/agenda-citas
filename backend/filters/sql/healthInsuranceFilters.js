const { FIELDS } = require('./constants');
const {
  validateQuery,
  initializeSQL,
  addTextSearchFilter,
  addIdFilter,
  addStatusFilter
} = require('./helpers');

function buildHealthInsuranceFilters(query) {
  query = validateQuery(query);
  let { sql, params } = initializeSQL();

  // Filtros de búsqueda de texto (LIKE)
  addTextSearchFilter(sql, params, FIELDS.NAME, query.nombre);
  addTextSearchFilter(sql, params, FIELDS.ADDRESS, query.direccion);
  addTextSearchFilter(sql, params, FIELDS.PHONE, query.telefono);

  // Filtros exactos
  addIdFilter(sql, params, FIELDS.CODE, query.codigo);
  addStatusFilter(sql, params, FIELDS.STATUS, query.estado);

  return { sql, params };
}

module.exports = { buildHealthInsuranceFilters }; 