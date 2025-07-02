const pool = require('../config/db');
const { buildPrescriptionFilters } = require('../filters/sql/prescriptionFilters');
const { buildPaginationAndOrder } = require('../filters/paginationUtils');

async function getAllPrescriptions() {
  const [rows] = await pool.query('SELECT * FROM prescriptions');
  return rows;
}

async function findPrescriptionsWithFilters(query) {
  const { sql, params } = buildPrescriptionFilters(query);
  let fullQuery = `SELECT * FROM prescriptions ${sql}`;
  // Paginación y ordenamiento
  const { sql: pagSql, params: pagParams } = buildPaginationAndOrder(
    query,
    ['prescription_id', 'patient_id', 'doctor_id', 'date', 'status', 'amount']
  );
  fullQuery += pagSql;
  const [rows] = await pool.query(fullQuery, [...params, ...pagParams]);
  return rows;
}

async function getPrescriptionById(id) {
  const [rows] = await pool.query('SELECT * FROM prescriptions WHERE prescription_id=?', [id]);
  return rows;
}

async function createPrescription(data) {
  const { patient_id, doctor_id, date, issued_by_secretary_id, amount, payment_method, payment_date } = data;
  const [result] = await pool.query(
    'INSERT INTO prescriptions (patient_id, doctor_id, date, issued_by_secretary_id, amount, payment_method, payment_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [patient_id, doctor_id, date, issued_by_secretary_id, amount, payment_method, payment_date]
  );
  return { prescription_id: result.insertId, ...data };
}

async function updatePrescription(id, data) {
  const { patient_id, doctor_id, date, issued_by_secretary_id, amount, payment_method, payment_date } = data;
  await pool.query(
    'UPDATE prescriptions SET patient_id=?, doctor_id=?, date=?, issued_by_secretary_id=?, amount=?, payment_method=?, payment_date=? WHERE prescription_id=?',
    [patient_id, doctor_id, date, issued_by_secretary_id, amount, payment_method, payment_date, id]
  );
  return { prescription_id: id, ...data };
}

async function deletePrescription(id) {
  await pool.query('DELETE FROM prescriptions WHERE prescription_id=?', [id]);
  return { prescription_id: id };
}

module.exports = { getAllPrescriptions, findPrescriptionsWithFilters, getPrescriptionById, createPrescription, updatePrescription, deletePrescription }; 