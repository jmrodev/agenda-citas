function buildPrescriptionFilters(query) {
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
  if (query.estado) {
    sql += ' AND estado = ?';
    params.push(query.estado);
  }
  if (query.medicamento) {
    sql += ' AND receta_id IN (SELECT receta_id FROM prescription_medications WHERE nombre LIKE ?)';
    params.push(`%${query.medicamento}%`);
  }
  return { sql, params };
}

module.exports = { buildPrescriptionFilters }; 