const pool = require('../config/db');

async function findUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

async function findUserByUsername(username) {
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
}

async function findUserById(userId) {
  const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [userId]);
  return rows[0];
}

async function findUserByEntityId(entityId, role) {
  const [rows] = await pool.query('SELECT * FROM users WHERE entity_id = ? AND role = ?', [entityId, role]);
  return rows[0];
}

async function createUser({ username, email, password, role, entity_id }) {
  const [result] = await pool.query(
    'INSERT INTO users (username, email, password, role, entity_id) VALUES (?, ?, ?, ?, ?)',
    [username, email, password, role, entity_id || null]
  );
  return { user_id: result.insertId, username, email, role, entity_id };
}

async function updateUserPassword(userId, hashedPassword) {
  const [result] = await pool.query(
    'UPDATE users SET password = ? WHERE user_id = ?',
    [hashedPassword, userId]
  );
  return result.affectedRows > 0;
}

async function updateUsername(userId, username) {
  const [result] = await pool.query(
    'UPDATE users SET username = ? WHERE user_id = ?',
    [username, userId]
  );
  return result.affectedRows > 0;
}

module.exports = { 
  findUserByEmail, 
  findUserByUsername, 
  findUserById,
  findUserByEntityId,
  createUser,
  updateUserPassword,
  updateUsername
}; 