const pool = require('../config/db');
const { buildReferencePersonFilters } = require('../filters/referencePersonFilters');
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

module.exports = { getReferencesByPatientId, findReferencePersonsWithFilters, addReference, updateReference, deleteReference, referenceBelongsToPatient }; 