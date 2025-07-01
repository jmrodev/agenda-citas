const pool = require('../config/db');

async function getAllPatients() {
  const [rows] = await pool.query('SELECT * FROM patients');
  return rows;
}

module.exports = { getAllPatients }; 