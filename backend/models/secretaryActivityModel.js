const pool = require('../config/db');

async function getAllSecretaryActivities() {
  const [rows] = await pool.query('SELECT * FROM secretary_activities');
  return rows;
}

module.exports = { getAllSecretaryActivities }; 