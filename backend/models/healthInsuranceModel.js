const pool = require('../config/db');

async function getAllHealthInsurances() {
  const [rows] = await pool.query('SELECT * FROM health_insurances');
  return rows;
}

module.exports = { getAllHealthInsurances }; 