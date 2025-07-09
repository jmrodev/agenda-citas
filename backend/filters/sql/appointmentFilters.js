function buildAppointmentFilters(query) {
  let sql = 'WHERE 1=1';
  const params = [];
  if (query.fecha) {
    sql += ' AND date = ?';
    params.push(query.fecha);
  }
  if (query.fecha_desde) {
    sql += ' AND date >= ?';
    params.push(query.fecha_desde);
  }
  if (query.fecha_hasta) {
    sql += ' AND date <= ?';
    params.push(query.fecha_hasta);
  }
  if (query.paciente_id) {
    sql += ' AND patient_id = ?';
    params.push(query.paciente_id);
  }
  if (query.doctor_id) {
    sql += ' AND doctor_id = ?';
    params.push(query.doctor_id);
  }
  if (query.obra_social_id) {
    sql += ' AND obra_social_id = ?';
    params.push(query.obra_social_id);
  }
  if (query.estado) {
    if (Array.isArray(query.estado)) {
      sql += ` AND status IN (${query.estado.map(() => '?').join(',')})`;
      params.push(...query.estado);
    } else {
      sql += ' AND status = ?';
      params.push(query.estado);
    }
  }
  return { sql, params };
}

module.exports = { buildAppointmentFilters }; 