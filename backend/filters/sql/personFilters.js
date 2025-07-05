function buildPersonFilters(query) {
  let sql = 'WHERE 1=1';
  const params = [];
  
  // Búsqueda por DNI (exacta) - ahora está en la tabla patients
  if (query.dni) {
    sql += ' AND dni = ?';
    params.push(query.dni);
  }
  
  // Búsqueda por nombre (parcial)
  if (query.nombre) {
    sql += ' AND first_name LIKE ?';
    params.push(`%${query.nombre}%`);
  }
  
  // Búsqueda por apellido (parcial)
  if (query.apellido) {
    sql += ' AND last_name LIKE ?';
    params.push(`%${query.apellido}%`);
  }
  
  // Búsqueda por dirección (parcial)
  if (query.direccion) {
    sql += ' AND address LIKE ?';
    params.push(`%${query.direccion}%`);
  }
  
  // Búsqueda por teléfono (parcial)
  if (query.telefono) {
    sql += ' AND phone LIKE ?';
    params.push(`%${query.telefono}%`);
  }
  
  // Búsqueda por email (parcial)
  if (query.email) {
    sql += ' AND email LIKE ?';
    params.push(`%${query.email}%`);
  }
  
  // Búsqueda por fecha de nacimiento (exacta)
  if (query.fecha_nacimiento) {
    sql += ' AND date_of_birth = ?';
    params.push(query.fecha_nacimiento);
  }
  
  // Búsqueda por obra social (ID)
  if (query.obra_social_id) {
    sql += ' AND health_insurance_id = ?';
    params.push(query.obra_social_id);
  }
  
  // Búsqueda por método de pago preferido (parcial)
  if (query.metodo_pago) {
    sql += ' AND preferred_payment_methods LIKE ?';
    params.push(`%${query.metodo_pago}%`);
  }
  
  // Búsqueda por persona de referencia (nombre o apellido)
  if (query.persona_referencia) {
    sql += ' AND (reference_name LIKE ? OR reference_last_name LIKE ?)';
    params.push(`%${query.persona_referencia}%`, `%${query.persona_referencia}%`);
  }
  
  // Búsqueda por teléfono de referencia (parcial)
  if (query.telefono_referencia) {
    sql += ' AND reference_phone LIKE ?';
    params.push(`%${query.telefono_referencia}%`);
  }
  
  // Búsqueda por relación de referencia (parcial)
  if (query.relacion_referencia) {
    sql += ' AND reference_relationship LIKE ?';
    params.push(`%${query.relacion_referencia}%`);
  }
  
  return { sql, params };
}

module.exports = { buildPersonFilters }; 