const { FIELDS } = require('./constants');
const {
  validateQuery,
  initializeSQL,
  addIdFilter,
  addDateFilter,
  addDateRangeFilter,
  addTextSearchFilter
} = require('./helpers');

function buildSecretaryActivityFilters(query) {
  query = validateQuery(query);
  let { sql, params } = initializeSQL();

  // Filtros de IDs
  addIdFilter(sql, params, FIELDS.SECRETARY_ID, query.secretary_id);

  // Filtros de fecha
  addDateFilter(sql, params, FIELDS.DATE, query.fecha);
  addDateRangeFilter(sql, params, FIELDS.DATE, query.fecha_desde, query.fecha_hasta);

  // Filtro de tipo de actividad
  addTextSearchFilter(sql, params, FIELDS.ACTIVITY_TYPE, query.tipo_actividad);

  return { sql, params };
}

module.exports = { buildSecretaryActivityFilters }; 