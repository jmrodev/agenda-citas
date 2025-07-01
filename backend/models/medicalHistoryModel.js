const pool = require('../config/db');

async function getAllMedicalHistory() {
  const [rows] = await pool.query('SELECT * FROM medical_history_records');
  return rows;
}

module.exports = { getAllMedicalHistory }; 