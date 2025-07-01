const pool = require('../config/db');

async function getAllPrescriptions() {
  const [rows] = await pool.query('SELECT * FROM prescriptions');
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

module.exports = { getAllPrescriptions, createPrescription, updatePrescription, deletePrescription }; 