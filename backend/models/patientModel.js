const pool = require('../config/db');

async function getAllPatients() {
  const [rows] = await pool.query('SELECT * FROM patients');
  return rows;
}

async function createPatient(data) {
  const { first_name, last_name, date_of_birth, address, phone, email, preferred_payment_methods, health_insurance_id } = data;
  const [result] = await pool.query(
    'INSERT INTO patients (first_name, last_name, date_of_birth, address, phone, email, preferred_payment_methods, health_insurance_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [first_name, last_name, date_of_birth, address, phone, email, preferred_payment_methods, health_insurance_id]
  );
  return { patient_id: result.insertId, ...data };
}

async function updatePatient(id, data) {
  const { first_name, last_name, date_of_birth, address, phone, email, preferred_payment_methods, health_insurance_id } = data;
  await pool.query(
    'UPDATE patients SET first_name=?, last_name=?, date_of_birth=?, address=?, phone=?, email=?, preferred_payment_methods=?, health_insurance_id=? WHERE patient_id=?',
    [first_name, last_name, date_of_birth, address, phone, email, preferred_payment_methods, health_insurance_id, id]
  );
  return { patient_id: id, ...data };
}

async function deletePatient(id) {
  await pool.query('DELETE FROM patients WHERE patient_id=?', [id]);
  return { patient_id: id };
}

module.exports = { getAllPatients, createPatient, updatePatient, deletePatient }; 