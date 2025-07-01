const pool = require('../config/db');
const { buildMedicalHistoryFilters } = require('../filters/medicalHistoryFilters');
const { buildPaginationAndOrder } = require('../filters/paginationUtils');

async function getAllMedicalHistories() {
  const [rows] = await pool.query('SELECT * FROM medical_histories');
  return rows;
}

async function findMedicalHistoriesWithFilters(query) {
  const { sql, params } = buildMedicalHistoryFilters(query);
  let fullQuery = `SELECT * FROM medical_histories ${sql}`;
  // Paginación y ordenamiento
  const { sql: pagSql, params: pagParams } = buildPaginationAndOrder(
    query,
    ['historial_id', 'paciente_id', 'doctor_id', 'fecha', 'diagnostico']
  );
  fullQuery += pagSql;
  const [rows] = await pool.query(fullQuery, [...params, ...pagParams]);
  return rows;
}

async function getAllMedicalHistory() {
  const [rows] = await pool.query('SELECT * FROM medical_history_records');
  return rows;
}

async function createMedicalHistory(data) {
  const { patient_id, date, attending_doctor_id, diagnosis, treatment, observations } = data;
  const [result] = await pool.query(
    'INSERT INTO medical_history_records (patient_id, date, attending_doctor_id, diagnosis, treatment, observations) VALUES (?, ?, ?, ?, ?, ?)',
    [patient_id, date, attending_doctor_id, diagnosis, treatment, observations]
  );
  return { record_id: result.insertId, ...data };
}

async function updateMedicalHistory(id, data) {
  const { patient_id, date, attending_doctor_id, diagnosis, treatment, observations } = data;
  await pool.query(
    'UPDATE medical_history_records SET patient_id=?, date=?, attending_doctor_id=?, diagnosis=?, treatment=?, observations=? WHERE record_id=?',
    [patient_id, date, attending_doctor_id, diagnosis, treatment, observations, id]
  );
  return { record_id: id, ...data };
}

async function deleteMedicalHistory(id) {
  await pool.query('DELETE FROM medical_history_records WHERE record_id=?', [id]);
  return { record_id: id };
}

module.exports = { getAllMedicalHistories, findMedicalHistoriesWithFilters, getAllMedicalHistory, createMedicalHistory, updateMedicalHistory, deleteMedicalHistory }; 