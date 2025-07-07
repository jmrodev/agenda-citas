const pool = require('../config/db');
const { buildReferencePersonFilters } = require('../filters/sql/referencePersonFilters');
const { buildPaginationAndOrder } = require('../filters/paginationUtils');

async function existsReferenceByDni(patient_id, dni) {
  const [rows] = await pool.query(
    'SELECT * FROM patient_references WHERE patient_id = ? AND dni = ?',
    [patient_id, dni]
  );
  return rows.length > 0;
}

async function getReferencesByPatientId(patient_id) {
  const [rows] = await pool.query('SELECT * FROM patient_references WHERE patient_id = ?', [patient_id]);
  return rows;
}

async function findReferencePersonsWithFilters(query) {
  const { sql, params } = buildReferencePersonFilters(query);
  let fullQuery = `SELECT * FROM patient_references ${sql}`;
  // Paginación y ordenamiento
  const { sql: pagSql, params: pagParams } = buildPaginationAndOrder(
    query,
    ['reference_id', 'patient_id', 'dni', 'nombre', 'apellido', 'telefono', 'direccion', 'parentesco']
  );
  fullQuery += pagSql;
  const [rows] = await pool.query(fullQuery, [...params, ...pagParams]);
  return rows;
}

async function addReference(patient_id, data) {
  const { dni, name, last_name, address, phone, relationship } = data;
  if (await existsReferenceByDni(patient_id, dni)) {
    const err = new Error('Ya existe una persona de referencia con ese DNI para este paciente');
    err.code = 'DUPLICATE_DNI';
    throw err;
  }
  const [result] = await pool.query(
    'INSERT INTO patient_references (patient_id, dni, name, last_name, address, phone, relationship) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [patient_id, dni, name, last_name, address, phone, relationship]
  );
  return { reference_id: result.insertId, patient_id, ...data };
}

async function updateReference(reference_id, data) {
  const { name, last_name, address, phone, relationship } = data;
  await pool.query(
    'UPDATE patient_references SET name=?, last_name=?, address=?, phone=?, relationship=? WHERE reference_id=?',
    [name, last_name, address, phone, relationship, reference_id]
  );
}

async function deleteReference(reference_id) {
  await pool.query('DELETE FROM patient_references WHERE reference_id=?', [reference_id]);
}

async function referenceBelongsToPatient(patient_id, reference_id) {
  const [rows] = await pool.query(
    'SELECT 1 FROM patient_references WHERE patient_id = ? AND reference_id = ?',
    [patient_id, reference_id]
  );
  return rows.length > 0;
}

async function getReferencesByPatientIds(patientIds) {
  if (!patientIds || patientIds.length === 0) {
    return {}; // Devuelve un objeto vacío si no hay IDs
  }
  const query = `
    SELECT *
    FROM patient_references
    WHERE patient_id IN (?)
    ORDER BY patient_id, last_name, name;
  `;
  const [rows] = await pool.query(query, [patientIds]);

  // Agrupar referencias por patient_id
  const referencesByPatientId = {};
  rows.forEach(row => {
    if (!referencesByPatientId[row.patient_id]) {
      referencesByPatientId[row.patient_id] = [];
    }
    referencesByPatientId[row.patient_id].push(row);
  });
  return referencesByPatientId;
}

async function getReferenceById(referenceId) {
  const [rows] = await pool.query('SELECT * FROM patient_references WHERE reference_id = ?', [referenceId]);
  return rows[0]; // Devuelve la primera fila o undefined si no se encuentra
}

module.exports = { getReferencesByPatientId, getReferencesByPatientIds, findReferencePersonsWithFilters, addReference, updateReference, deleteReference, referenceBelongsToPatient, getReferenceById };