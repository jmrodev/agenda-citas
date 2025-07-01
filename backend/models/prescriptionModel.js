const pool = require('../config/db');

async function getAllPrescriptions() {
  const [rows] = await pool.query('SELECT * FROM prescriptions');
  return rows;
}

module.exports = { getAllPrescriptions }; 