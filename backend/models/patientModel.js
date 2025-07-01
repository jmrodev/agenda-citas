const pool = require('../config/db');

async function getAllPatients() {
  const [rows] = await pool.query('SELECT * FROM patients');
  return rows;
}

async function createPatient(data) {
  const { first_name, last_name, date_of_birth, address, phone, email, preferred_payment_methods, health_insurance_id, reference_person } = data;
  const [result] = await pool.query(
    'INSERT INTO patients (first_name, last_name, date_of_birth, address, phone, email, preferred_payment_methods, health_insurance_id, reference_name, reference_last_name, reference_address, reference_phone, reference_relationship) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [first_name, last_name, date_of_birth, address, phone, email, preferred_payment_methods, health_insurance_id,
      reference_person?.name || null,
      reference_person?.last_name || null,
      reference_person?.address || null,
      reference_person?.phone || null,
      reference_person?.relationship || null
    ]
  );
  return { patient_id: result.insertId, ...data };
}

async function updatePatient(id, data) {
  const { first_name, last_name, date_of_birth, address, phone, email, preferred_payment_methods, health_insurance_id, reference_person } = data;
  await pool.query(
    'UPDATE patients SET first_name=?, last_name=?, date_of_birth=?, address=?, phone=?, email=?, preferred_payment_methods=?, health_insurance_id=?, reference_name=?, reference_last_name=?, reference_address=?, reference_phone=?, reference_relationship=? WHERE patient_id=?',
    [first_name, last_name, date_of_birth, address, phone, email, preferred_payment_methods, health_insurance_id,
      reference_person?.name || null,
      reference_person?.last_name || null,
      reference_person?.address || null,
      reference_person?.phone || null,
      reference_person?.relationship || null,
      id
    ]
  );
}

async function deletePatient(id) {
  await pool.query('DELETE FROM patients WHERE patient_id=?', [id]);
  return { patient_id: id };
}

async function getPatientById(id) {
  const [rows] = await pool.query('SELECT * FROM patients WHERE patient_id = ?', [id]);
  return rows[0];
}

module.exports = { getAllPatients, createPatient, updatePatient, deletePatient, getPatientById }; 