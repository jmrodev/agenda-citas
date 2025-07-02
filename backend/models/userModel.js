const pool = require('../config/db');

async function findUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

async function findUserByUsername(username) {
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
}

async function createUser({ username, email, password, role, entity_id }) {
  const [result] = await pool.query(
    'INSERT INTO users (username, email, password, role, entity_id) VALUES (?, ?, ?, ?, ?)',
    [username, email, password, role, entity_id || null]
  );
  return { user_id: result.insertId, username, email, role, entity_id };
}

module.exports = { findUserByEmail, findUserByUsername, createUser }; 