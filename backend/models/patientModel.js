const pool = require('../config/db');
const { buildPersonFilters } = require('../filters/sql/personFilters');
const { buildPaginationAndOrder } = require('../filters/paginationUtils');
const { debugPatients } = require('../utils/debug');

async function getAllPatients() {
  const [rows] = await pool.query('SELECT * FROM patients');
  return rows;
}

async function findPatientsWithFilters(query) {
  const { sql, params } = buildPersonFilters(query);
  let fullQuery = `SELECT * FROM patients ${sql}`;
  // Paginación y ordenamiento
  const { sql: pagSql, params: pagParams } = buildPaginationAndOrder(
    query,
    ['patient_id', 'first_name', 'last_name', 'dni', 'address', 'phone', 'email', 'date_of_birth']
  );
  fullQuery += pagSql;
  const [rows] = await pool.query(fullQuery, [...params, ...pagParams]);
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
  await pool.query('DELETE FROM patients WHERE patient_id = ?', [id]);
  return { patient_id: id };
}

async function getPatientById(id) {
  const [rows] = await pool.query('SELECT * FROM patients WHERE patient_id = ?', [id]);
  return rows[0];
}

async function addDoctorsToPatient(patient_id, doctor_ids) {
  if (!Array.isArray(doctor_ids)) return;
  for (const doctor_id of doctor_ids) {
    await pool.query('INSERT INTO patient_doctors (patient_id, doctor_id) VALUES (?, ?)', [patient_id, doctor_id]);
  }
}

async function getDoctorsByPatientId(patient_id) {
  const [rows] = await pool.query('SELECT doctor_id FROM patient_doctors WHERE patient_id = ?', [patient_id]);
  return rows.map(r => r.doctor_id);
}

async function removeAllDoctorsFromPatient(patient_id) {
  await pool.query('DELETE FROM patient_doctors WHERE patient_id = ?', [patient_id]);
}

async function removeDoctorFromPatient(patient_id, doctor_id) {
  await pool.query('DELETE FROM patient_doctors WHERE patient_id = ? AND doctor_id = ?', [patient_id, doctor_id]);
}

async function countPatients() {
  debugPatients('countPatients llamado');
  try {
    debugPatients('Ejecutando query: SELECT COUNT(*) as total FROM patients');
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM patients');
    debugPatients('Resultado de la query:', rows);
    const result = rows[0].total;
    debugPatients('Total pacientes:', result);
    return result;
  } catch (error) {
    debugPatients('Error en countPatients:', error);
    throw error;
  }
}

module.exports = { getAllPatients, findPatientsWithFilters, createPatient, updatePatient, deletePatient, getPatientById, addDoctorsToPatient, getDoctorsByPatientId, removeAllDoctorsFromPatient, removeDoctorFromPatient, countPatients }; 