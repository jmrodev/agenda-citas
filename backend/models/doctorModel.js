const pool = require('../config/db');

async function getAllDoctors() {
  const [rows] = await pool.query('SELECT * FROM doctors');
  return rows;
}

async function createDoctor(data) {
  const { first_name, last_name, specialty, license_number, phone, email, consultation_fee, prescription_fee, last_earnings_collection_date } = data;
  const [result] = await pool.query(
    'INSERT INTO doctors (first_name, last_name, specialty, license_number, phone, email, consultation_fee, prescription_fee, last_earnings_collection_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [first_name, last_name, specialty, license_number, phone, email, consultation_fee, prescription_fee, last_earnings_collection_date]
  );
  return { doctor_id: result.insertId, ...data };
}

async function updateDoctor(id, data) {
  const { first_name, last_name, specialty, license_number, phone, email, consultation_fee, prescription_fee, last_earnings_collection_date } = data;
  await pool.query(
    'UPDATE doctors SET first_name=?, last_name=?, specialty=?, license_number=?, phone=?, email=?, consultation_fee=?, prescription_fee=?, last_earnings_collection_date=? WHERE doctor_id=?',
    [first_name, last_name, specialty, license_number, phone, email, consultation_fee, prescription_fee, last_earnings_collection_date, id]
  );
  return { doctor_id: id, ...data };
}

async function deleteDoctor(id) {
  await pool.query('DELETE FROM doctors WHERE doctor_id=?', [id]);
  return { doctor_id: id };
}

async function getDoctorById(id) {
  const [rows] = await pool.query('SELECT * FROM doctors WHERE doctor_id = ?', [id]);
  return rows[0] || null;
}

module.exports = { getAllDoctors, createDoctor, updateDoctor, deleteDoctor, getDoctorById }; 