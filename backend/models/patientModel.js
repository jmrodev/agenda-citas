const pool = require('../config/db');
const { buildPersonFilters } = require('../filters/sql/personFilters');
const { buildPaginationAndOrder } = require('../filters/paginationUtils');
const { debugPatients } = require('../utils/debug');

async function getAllPatients() {
  const [rows] = await pool.query('SELECT * FROM patients');
  return rows;
}

async function findPatientsWithFilters(query) {
  // Construye la parte WHERE y los parámetros para los filtros básicos de persona
  const { sql: personFilterSql, params: personParams } = buildPersonFilters(query);

  let joinClause = '';
  // Si el filtro de assigned_doctor_id está presente, necesitamos unir con patient_doctors
  if (query.assigned_doctor_id) {
    joinClause = 'INNER JOIN patient_doctors pd ON patients.patient_id = pd.patient_id';
  }

  // Usamos DISTINCT patients.* para asegurar que cada paciente solo aparezca una vez en el resultado base,
  // especialmente relevante si el JOIN (como con patient_doctors para el filtro assigned_doctor_id)
  // pudiera causar que un paciente aparezca múltiples veces si no se maneja con cuidado.
  // Los detalles de los doctores se obtienen por separado y se agregan después en el servicio.
  let fullQuery = `SELECT DISTINCT patients.* FROM patients ${joinClause} ${personFilterSql}`;
  
  // Paginación y ordenamiento
  // Las columnas para ordenar deben existir en la tabla `patients` o ser calificadas si hay ambigüedad.
  const { sql: pagSql, params: pagParams } = buildPaginationAndOrder(
    query,
    // Calificar nombres de columna con 'patients.' para evitar ambigüedad si se añaden más JOINs en el futuro
    ['patients.patient_id', 'patients.first_name', 'patients.last_name', 'patients.dni', 'patients.address', 'patients.phone', 'patients.email', 'patients.date_of_birth']
  );
  fullQuery += pagSql;

  const finalParams = [...personParams, ...pagParams];
  const [rows] = await pool.query(fullQuery, finalParams);
  return rows;
}

async function createPatient(data) {
  const { first_name, last_name, date_of_birth, address, phone, email, preferred_payment_methods, health_insurance_id, health_insurance_member_number, reference_person } = data;
  const [result] = await pool.query(
    'INSERT INTO patients (first_name, last_name, date_of_birth, address, phone, email, preferred_payment_methods, health_insurance_id, health_insurance_member_number, reference_name, reference_last_name, reference_address, reference_phone, reference_relationship) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [first_name, last_name, date_of_birth, address, phone, email, preferred_payment_methods, health_insurance_id, health_insurance_member_number,
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
  const { first_name, last_name, date_of_birth, address, phone, email, preferred_payment_methods, health_insurance_id, health_insurance_member_number, reference_person } = data;
  await pool.query(
    'UPDATE patients SET first_name=?, last_name=?, date_of_birth=?, address=?, phone=?, email=?, preferred_payment_methods=?, health_insurance_id=?, health_insurance_member_number=?, reference_name=?, reference_last_name=?, reference_address=?, reference_phone=?, reference_relationship=? WHERE patient_id=?',
    [first_name, last_name, date_of_birth, address, phone, email, preferred_payment_methods, health_insurance_id, health_insurance_member_number,
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

async function getDoctorsForPatientIds(patientIds) {
  if (!patientIds || patientIds.length === 0) {
    return {}; // Devuelve un objeto vacío si no hay IDs
  }
  // El placeholder (?) se expandirá automáticamente por node-mysql2 para listas
  const query = `
    SELECT pd.patient_id, d.doctor_id, d.first_name, d.last_name, d.specialty, d.email as doctor_email, d.phone as doctor_phone
    FROM doctors d
    INNER JOIN patient_doctors pd ON d.doctor_id = pd.doctor_id
    WHERE pd.patient_id IN (?)
    ORDER BY pd.patient_id, d.last_name, d.first_name;
  `;
  const [rows] = await pool.query(query, [patientIds]);

  // Agrupar doctores por patient_id
  const doctorsByPatientId = {};
  rows.forEach(row => {
    if (!doctorsByPatientId[row.patient_id]) {
      doctorsByPatientId[row.patient_id] = [];
    }
    doctorsByPatientId[row.patient_id].push({
      doctor_id: row.doctor_id,
      first_name: row.first_name,
      last_name: row.last_name,
      specialty: row.specialty,
      email: row.doctor_email,
      phone: row.doctor_phone
      // Añade otros campos del doctor que necesites
    });
  });
  return doctorsByPatientId;
}

module.exports = { getAllPatients, findPatientsWithFilters, createPatient, updatePatient, deletePatient, getPatientById, addDoctorsToPatient, getDoctorsByPatientId, getDoctorsForPatientIds, removeAllDoctorsFromPatient, removeDoctorFromPatient, countPatients };