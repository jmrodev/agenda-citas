const { FIELDS, TABLES } = require('./constants');
const {
  validateQuery,
  initializeSQL,
  addIdFilter,
  addDateFilter,
  addDateRangeFilter,
  addTextSearchFilter
} = require('./helpers');

function buildMedicalHistoryFilters(query) {
  query = validateQuery(query);
  let { sql, params } = initializeSQL();

  // Filtros de IDs
  addIdFilter(sql, params, FIELDS.PATIENT_ID, query.paciente_id);
  addIdFilter(sql, params, FIELDS.DOCTOR_ID, query.doctor_id);

  // Filtros de fecha
  addDateFilter(sql, params, FIELDS.DATE, query.fecha);
  addDateRangeFilter(sql, params, FIELDS.DATE, query.fecha_desde, query.fecha_hasta);

  // Filtros de texto
  addTextSearchFilter(sql, params, FIELDS.DIAGNOSIS, query.diagnostico);

  // Filtro de medicamento (subconsulta)
  if (query.medicamento) {
    sql += ` AND ${FIELDS.ID} IN (SELECT ${FIELDS.ID} FROM ${TABLES.MEDICAL_RECORD_PRESCRIBED_MED} WHERE ${FIELDS.MEDICATION_NAME} LIKE ?)`;
    params.push(`%${query.medicamento}%`);
  }

  return { sql, params };
}

module.exports = { buildMedicalHistoryFilters }; 