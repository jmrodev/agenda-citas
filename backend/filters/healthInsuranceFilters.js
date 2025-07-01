function buildHealthInsuranceFilters(query) {
  let sql = 'WHERE 1=1';
  const params = [];
  if (query.nombre) {
    sql += ' AND nombre LIKE ?';
    params.push(`%${query.nombre}%`);
  }
  if (query.codigo) {
    sql += ' AND codigo = ?';
    params.push(query.codigo);
  }
  if (query.direccion) {
    sql += ' AND direccion LIKE ?';
    params.push(`%${query.direccion}%`);
  }
  if (query.telefono) {
    sql += ' AND telefono LIKE ?';
    params.push(`%${query.telefono}%`);
  }
  if (query.estado) {
    sql += ' AND estado = ?';
    params.push(query.estado);
  }
  return { sql, params };
}

module.exports = { buildHealthInsuranceFilters }; 