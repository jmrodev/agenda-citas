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
  // Quitar reference_person de la desestructuración. Añadir dni y doctor_id si se manejan aquí.
  const {
    first_name, last_name, date_of_birth, address, phone, email, dni,
    preferred_payment_methods, health_insurance_id, health_insurance_member_number,
    doctor_id // Asumiendo que doctor_id en la tabla patients es el 'médico de cabecera'
  } = data;

  const sql = `INSERT INTO patients (
                 first_name, last_name, date_of_birth, address, phone, email, dni,
                 preferred_payment_methods, health_insurance_id, health_insurance_member_number, doctor_id
               ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    first_name, last_name, date_of_birth, address, phone, email, dni,
    preferred_payment_methods, health_insurance_id, health_insurance_member_number, doctor_id
  ];

  const [result] = await pool.query(sql, params);
  // data puede contener reference_person y doctor_ids (para patient_doctors),
  // pero esos se manejan en el servicio después de crear el paciente base.
  return { patient_id: result.insertId, ...data };
}

async function updatePatient(id, data) {
  // Quitar reference_person de la desestructuración. Añadir dni y doctor_id.
  const {
    first_name, last_name, date_of_birth, address, phone, email, dni,
    preferred_payment_methods, health_insurance_id, health_insurance_member_number,
    doctor_id
  } = data;

  const sql = `UPDATE patients SET
                 first_name=?, last_name=?, date_of_birth=?, address=?, phone=?, email=?, dni=?,
                 preferred_payment_methods=?, health_insurance_id=?, health_insurance_member_number=?, doctor_id=?
               WHERE patient_id=?`;
  const params = [
    first_name, last_name, date_of_birth, address, phone, email, dni,
    preferred_payment_methods, health_insurance_id, health_insurance_member_number, doctor_id,
    id
  ];

  await pool.query(sql, params);
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

async function getPatientReportStats(startDate, endDate, rangeKey) {
  const params = [startDate, endDate];
  const today = new Date().toISOString().split('T')[0]; // Para calcular edad actual

  // 1. Total de pacientes activos (todos los pacientes en la tabla)
  const [[{ totalActivePatients }]] = await pool.query('SELECT COUNT(*) as totalActivePatients FROM patients WHERE date_of_birth IS NOT NULL');

  // 2. Nuevos pacientes en el período
  const [[{ newPatientsInPeriod }]] = await pool.query(
    'SELECT COUNT(*) as newPatientsInPeriod FROM patients WHERE created_at >= ? AND created_at <= ?',
    params
  );

  // 3. Conteo de nuevos pacientes agrupados por período (mes o día)
  // Determinar el formato de agrupación basado en la duración del rango
  const dateDiff = (new Date(endDate)).getTime() - (new Date(startDate)).getTime();
  const diffDays = Math.ceil(dateDiff / (1000 * 3600 * 24));
  const groupByFormat = diffDays > 60 ? '%Y-%m' : '%Y-%m-%d'; // Agrupar por mes si > 60 días, sino por día
  const periodLabel = diffDays > 60 ? 'month' : 'day';

  const [newPatientsByTimePeriodRows] = await pool.query(
    `SELECT DATE_FORMAT(created_at, ?) as period, COUNT(*) as newPatients
     FROM patients
     WHERE created_at >= ? AND created_at <= ?
     GROUP BY period
     ORDER BY period ASC`,
    [groupByFormat, startDate, endDate]
  );
  // Mapear para que coincida con la estructura esperada por el frontend (ResponsiveLineChart)
  const newPatientsByTimePeriod = newPatientsByTimePeriodRows.map(row => ({
    period: row.period, // 'YYYY-MM' o 'YYYY-MM-DD'
    newPatients: row.newPatients
  }));

  // 4. Edad promedio
  const [[{ averageAge }]] = await pool.query(
    `SELECT AVG(TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE())) as averageAge
     FROM patients
     WHERE date_of_birth IS NOT NULL`
  );

  // 5. Distribución por grupo de edad
  const ageGroupQuery = `
    SELECT
      SUM(CASE WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 0 AND 18 THEN 1 ELSE 0 END) as '0-18',
      SUM(CASE WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 19 AND 35 THEN 1 ELSE 0 END) as '19-35',
      SUM(CASE WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 36 AND 50 THEN 1 ELSE 0 END) as '36-50',
      SUM(CASE WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 51 AND 65 THEN 1 ELSE 0 END) as '51-65',
      SUM(CASE WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) > 65 THEN 1 ELSE 0 END) as '66+'
    FROM patients
    WHERE date_of_birth IS NOT NULL;
  `;
  const [[ageGroupCounts]] = await pool.query(ageGroupQuery);

  // Convertir el objeto de ageGroupCounts a un array como lo espera el frontend para el BarChart
  const byAgeGroup = Object.entries(ageGroupCounts).map(([ageGroup, count]) => ({
    ageGroup,
    count: parseInt(count, 10) || 0 // Asegurar que sea número
  }));

  return {
    summary: {
      totalActivePatients: totalActivePatients || 0,
      newPatientsInPeriod: newPatientsInPeriod || 0,
      averageAge: (typeof averageAge === 'number' && !isNaN(averageAge)) ? averageAge.toFixed(1) : null,
      // growthPercentage se calculará en el servicio si es necesario
    },
    byTimePeriod: newPatientsByTimePeriod,
    byAgeGroup: byAgeGroup,
    debug: {
        receivedStartDate: startDate,
        receivedEndDate: endDate,
        diffDays,
        groupByFormatUsed: groupByFormat,
        periodLabelUsed: periodLabel
    }
  };
}


module.exports = { getAllPatients, findPatientsWithFilters, createPatient, updatePatient, deletePatient, getPatientById, addDoctorsToPatient, getDoctorsByPatientId, getDoctorsForPatientIds, removeAllDoctorsFromPatient, removeDoctorFromPatient, countPatients, getPatientReportStats };