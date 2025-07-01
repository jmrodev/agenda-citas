function buildSecretaryActivityFilters(query) {
  let sql = 'WHERE 1=1';
  const params = [];
  if (query.secretary_id) {
    sql += ' AND secretary_id = ?';
    params.push(query.secretary_id);
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
  if (query.tipo_actividad) {
    sql += ' AND tipo_actividad = ?';
    params.push(query.tipo_actividad);
  }
  return { sql, params };
}

module.exports = { buildSecretaryActivityFilters }; 