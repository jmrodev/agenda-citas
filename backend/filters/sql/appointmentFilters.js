function buildAppointmentFilters(query) {
  let sql = 'WHERE 1=1';
  const params = [];
  if (query.fecha) {
    sql += ' AND fecha = ?';
    params.push(query.fecha);
  }
  if (query.fecha_desde) {
    sql += ' AND fecha >= ?';
    params.push(query.fecha_desde);
  }
  if (query.fecha_hasta) {
    sql += ' AND fecha <= ?';
    params.push(query.fecha_hasta);
  }
  if (query.paciente_id) {
    sql += ' AND paciente_id = ?';
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
    sql += ' AND estado = ?';
    params.push(query.estado);
  }
  return { sql, params };
}

module.exports = { buildAppointmentFilters }; 