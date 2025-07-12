const { FIELDS } = require('./constants');
const {
  validateQuery,
  initializeSQL,
  addDateFilter,
  addDateRangeFilter,
  addIdFilter,
  addStatusFilter
} = require('./helpers');

function buildAppointmentFilters(query) {
  query = validateQuery(query);
  let { sql, params } = initializeSQL();

  // Filtros de fecha
  addDateFilter(sql, params, FIELDS.DATE, query.fecha);
  addDateRangeFilter(sql, params, FIELDS.DATE, query.fecha_desde, query.fecha_hasta);

  // Filtros de IDs
  addIdFilter(sql, params, FIELDS.PATIENT_ID, query.paciente_id);
  addIdFilter(sql, params, FIELDS.DOCTOR_ID, query.doctor_id);
  addIdFilter(sql, params, FIELDS.HEALTH_INSURANCE_ID, query.obra_social_id);

  // Filtro de estado
  addStatusFilter(sql, params, FIELDS.STATUS, query.estado);

  return { sql, params };
}

module.exports = { buildAppointmentFilters }; 