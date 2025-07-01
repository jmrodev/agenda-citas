function buildMedicalHistoryFilters(query) {
  let sql = 'WHERE 1=1';
  const params = [];
  if (query.paciente_id) {
    sql += ' AND paciente_id = ?';
    params.push(query.paciente_id);
  }
  if (query.doctor_id) {
    sql += ' AND doctor_id = ?';
    params.push(query.doctor_id);
  }
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
  if (query.diagnostico) {
    sql += ' AND diagnostico LIKE ?';
    params.push(`%${query.diagnostico}%`);
  }
  if (query.medicamento) {
    sql += ' AND historial_id IN (SELECT historial_id FROM medical_record_prescribed_med WHERE nombre LIKE ?)';
    params.push(`%${query.medicamento}%`);
  }
  return { sql, params };
}

module.exports = { buildMedicalHistoryFilters }; 