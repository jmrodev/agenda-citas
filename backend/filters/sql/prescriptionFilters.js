const { FIELDS, TABLES } = require('./constants');
const {
  validateQuery,
  initializeSQL,
  addIdFilter,
  addDateFilter,
  addDateRangeFilter,
  addStatusFilter
} = require('./helpers');

function buildPrescriptionFilters(query) {
  query = validateQuery(query);
  let { sql, params } = initializeSQL();

  // Filtros de IDs
  addIdFilter(sql, params, FIELDS.PATIENT_ID, query.paciente_id);
  addIdFilter(sql, params, FIELDS.DOCTOR_ID, query.doctor_id);

  // Filtros de fecha
  addDateFilter(sql, params, FIELDS.DATE, query.fecha);
  addDateRangeFilter(sql, params, FIELDS.DATE, query.fecha_desde, query.fecha_hasta);

  // Filtro de estado
  addStatusFilter(sql, params, FIELDS.STATUS, query.estado);

  // Filtro de medicamento (subconsulta)
  if (query.medicamento) {
    sql += ` AND ${FIELDS.PRESCRIPTION_ID} IN (SELECT ${FIELDS.PRESCRIPTION_ID} FROM ${TABLES.PRESCRIPTION_MEDICATIONS} WHERE ${FIELDS.MEDICATION_NAME} LIKE ?)`;
    params.push(`%${query.medicamento}%`);
  }

  return { sql, params };
}

module.exports = { buildPrescriptionFilters }; 