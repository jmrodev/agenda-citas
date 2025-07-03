const db = require('../config/db');

exports.getConfigByUserId = async (userId) => {
  const [rows] = await db.query('SELECT * FROM user_config WHERE user_id = ?', [userId]);
  if (rows.length === 0) {
    // Si no existe, crear con valores por defecto
    await db.query('INSERT INTO user_config (user_id, session_timeout_minutes) VALUES (?, ?)', [userId, 15]);
    return { session_timeout_minutes: 15 };
  }
  return rows[0];
};

exports.updateConfigByUserId = async (userId, { session_timeout_minutes }) => {
  await db.query('UPDATE user_config SET session_timeout_minutes = ? WHERE user_id = ?', [session_timeout_minutes, userId]);
}; 