const pool = require('../config/db');

// Crear una nueva secretaria
async function createSecretary(data) {
  const { first_name, last_name, email, phone, shift, entry_time, exit_time } = data;
  const name = `${first_name} ${last_name}`.trim();
  
  const [result] = await pool.query(
    'INSERT INTO secretaries (name, first_name, last_name, email, phone, shift, entry_time, exit_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, first_name, last_name, email, phone, shift, entry_time, exit_time]
  );
  
  // Obtener la secretaria creada
  const [rows] = await pool.query('SELECT * FROM secretaries WHERE secretary_id = ?', [result.insertId]);
  return rows[0];
}

// Obtener todas las secretarias
async function getAllSecretaries() {
  const [rows] = await pool.query('SELECT * FROM secretaries ORDER BY name');
  return rows;
}

// Obtener una secretaria por ID
async function getSecretaryById(id) {
  const [rows] = await pool.query('SELECT * FROM secretaries WHERE secretary_id = ?', [id]);
  return rows[0];
}

// Actualizar una secretaria
async function updateSecretary(id, data) {
  const { first_name, last_name, email, phone, shift, entry_time, exit_time } = data;
  const name = `${first_name} ${last_name}`.trim();
  
  const query = 'UPDATE secretaries SET name = ?, first_name = ?, last_name = ?, email = ?, phone = ?, shift = ?, entry_time = ?, exit_time = ? WHERE secretary_id = ?';
  const params = [name, first_name, last_name, email, phone, shift, entry_time, exit_time, id];
  
  const [result] = await pool.query(query, params);
  
  if (result.affectedRows === 0) {
    return null;
  }
  
  // Obtener la secretaria actualizada
  const [rows] = await pool.query('SELECT * FROM secretaries WHERE secretary_id = ?', [id]);
  return rows[0];
}

// Eliminar una secretaria
async function deleteSecretary(id) {
  const [result] = await pool.query('DELETE FROM secretaries WHERE secretary_id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { 
  createSecretary,
  getAllSecretaries,
  getSecretaryById,
  updateSecretary,
  deleteSecretary
}; 