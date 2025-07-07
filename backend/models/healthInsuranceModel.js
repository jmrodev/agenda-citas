const pool = require('../config/db');
const { buildHealthInsuranceFilters } = require('../filters/sql/healthInsuranceFilters');
const { buildPaginationAndOrder } = require('../filters/paginationUtils');

async function getAllHealthInsurances() {
  const [rows] = await pool.query('SELECT * FROM health_insurances');
  return rows;
}

async function createHealthInsurance(data) {
  const { name, address, phone, email } = data;
  const [result] = await pool.query(
    'INSERT INTO health_insurances (name, address, phone, email) VALUES (?, ?, ?, ?)',
    [name, address, phone, email]
  );
  return { insurance_id: result.insertId, ...data };
}

async function updateHealthInsurance(id, data) {
  const { name, address, phone, email } = data;
  await pool.query(
    'UPDATE health_insurances SET name=?, address=?, phone=?, email=? WHERE insurance_id=?',
    [name, address, phone, email, id]
  );
  return { insurance_id: id, ...data };
}

async function deleteHealthInsurance(id) {
  await pool.query('DELETE FROM health_insurances WHERE insurance_id=?', [id]);
  return { insurance_id: id };
}

async function getHealthInsuranceById(id) {
  const [rows] = await pool.query('SELECT * FROM health_insurances WHERE insurance_id = ?', [id]);
  return rows[0];
}

module.exports = { getAllHealthInsurances, createHealthInsurance, updateHealthInsurance, deleteHealthInsurance, getHealthInsuranceById };