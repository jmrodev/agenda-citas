const pool = require('../config/db');

async function findUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

async function createUser({ email, password, role, entity_id }) {
  const [result] = await pool.query(
    'INSERT INTO users (email, password, role, entity_id) VALUES (?, ?, ?, ?)',
    [email, password, role, entity_id || null]
  );
  return { user_id: result.insertId, email, role, entity_id };
}

module.exports = { findUserByEmail, createUser }; 