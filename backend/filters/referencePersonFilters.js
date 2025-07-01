function buildReferencePersonFilters(query) {
  let sql = 'WHERE 1=1';
  const params = [];
  if (query.paciente_id) {
    sql += ' AND paciente_id = ?';
    params.push(query.paciente_id);
  }
  if (query.dni) {
    sql += ' AND dni = ?';
    params.push(query.dni);
  }
  if (query.nombre) {
    sql += ' AND nombre LIKE ?';
    params.push(`%${query.nombre}%`);
  }
  if (query.apellido) {
    sql += ' AND apellido LIKE ?';
    params.push(`%${query.apellido}%`);
  }
  if (query.telefono) {
    sql += ' AND telefono LIKE ?';
    params.push(`%${query.telefono}%`);
  }
  if (query.direccion) {
    sql += ' AND direccion LIKE ?';
    params.push(`%${query.direccion}%`);
  }
  if (query.parentesco) {
    sql += ' AND parentesco LIKE ?';
    params.push(`%${query.parentesco}%`);
  }
  return { sql, params };
}

module.exports = { buildReferencePersonFilters }; 