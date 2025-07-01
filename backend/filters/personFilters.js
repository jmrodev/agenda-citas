function buildPersonFilters(query) {
  let sql = 'WHERE 1=1';
  const params = [];
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
  if (query.direccion) {
    sql += ' AND direccion LIKE ?';
    params.push(`%${query.direccion}%`);
  }
  if (query.telefono) {
    sql += ' AND telefono LIKE ?';
    params.push(`%${query.telefono}%`);
  }
  return { sql, params };
}

module.exports = { buildPersonFilters }; 