const pool = require('../config/db');

async function createSecretary(data) {
  const { first_name, last_name, shift, entry_time, exit_time, email } = data;
  const [result] = await pool.query(
    'INSERT INTO secretaries (first_name, last_name, shift, entry_time, exit_time, email) VALUES (?, ?, ?, ?, ?, ?)',
    [first_name, last_name, shift, entry_time, exit_time, email]
  );
  return { secretary_id: result.insertId, ...data };
}

module.exports = { createSecretary }; 