function buildPaginationAndOrder({ limit, offset, order_by, order_dir }, allowedFields = []) {
  let sql = '';
  const params = [];

  // Ordenamiento seguro solo por campos permitidos
  if (order_by && allowedFields.includes(order_by)) {
    sql += ` ORDER BY ${order_by} ${order_dir && order_dir.toLowerCase() === 'desc' ? 'DESC' : 'ASC'}`;
  }

  // Paginación
  if (limit) {
    sql += ' LIMIT ?';
    params.push(Number(limit));
    if (offset) {
      sql += ' OFFSET ?';
      params.push(Number(offset));
    }
  }

  return { sql, params };
}

module.exports = { buildPaginationAndOrder }; 