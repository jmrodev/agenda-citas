const patientModel = require('../models/patientModel');
const patientReferenceModel = require('../models/patientReferenceModel');
const { debugPatients } = require('../utils/debug');
const { buildPersonFilters } = require('../filters/sql/personFilters');
const pool = require('../config/db');

// mapReferencePerson ya no es necesaria, se elimina.

// Versión CORRECTA y refactorizada de listPatients
async function listPatients(query, user) {
  let effectiveQuery = { ...query };

  // Lógica de roles para modificar la query
  // Si es un doctor y no se pide un doctor_id específico, filtrar por su propio id.
  if (user && user.role === 'doctor' && !effectiveQuery.doctor_id) {
    // Si es un doctor y no se pide un doctor_id específico, filtrar por su propio id.
    // Este filtro 'assigned_doctor_id' necesitaría ser manejado por findPatientsWithFilters/buildPersonFilters
    effectiveQuery.assigned_doctor_id = user.entity_id;
  } else if (effectiveQuery.doctor_id) {
    // Si se pasa doctor_id en la query, usarlo.
    effectiveQuery.assigned_doctor_id = effectiveQuery.doctor_id;
    // delete effectiveQuery.doctor_id; // Opcional: limpiar para no confundir a buildPersonFilters
  }

  // Usamos findPatientsWithFilters para todas las recuperaciones de listas de pacientes.
  // getAllPatients ya no se usa directamente para listados con detalles.
  const basePatients = await patientModel.findPatientsWithFilters(effectiveQuery);
  return enrichPatientsDetails(basePatients);
}

// Versión CORRECTA y refactorizada de listPatientsWithFilters
async function listPatientsWithFilters(query) {
  // Esta función ahora es la principal para cualquier listado filtrado.
  // La lógica de roles (como la de un doctor viendo solo sus pacientes)
  // se maneja en `listPatients` si se llama desde allí, o si se llama
  // directamente desde un controlador que ya ha aplicado lógica de roles a la query.
  const basePatients = await patientModel.findPatientsWithFilters(query);
  return enrichPatientsDetails(basePatients);
}

// Función helper para enriquecer pacientes con doctores y referencias
async function enrichPatientsDetails(basePatients) {
  if (!basePatients || basePatients.length === 0) {
    return [];
  }
  // Filtrar IDs nulos o undefined que podrían venir de basePatients si hubo algún problema
  const patientIds = basePatients.map(p => p.patient_id).filter(id => id != null);

  // Si no hay IDs válidos después de filtrar, devolver los pacientes base.
  // Ya no se aplica mapReferencePerson aquí.
  if (patientIds.length === 0) {
     return basePatients;
  }

  const [doctorsByPatientId, referencesByPatientId] = await Promise.all([
    patientModel.getDoctorsForPatientIds(patientIds),
    patientReferenceModel.getReferencesByPatientIds(patientIds)
  ]);

  return basePatients.map(patient => {
    // patient ya es el objeto base de la tabla patients.
    return Object.assign({}, patient, { // Usar patient directamente
      reference_persons: patient && patient.patient_id ? (referencesByPatientId[patient.patient_id] || []) : [],
      doctors: patient && patient.patient_id ? (doctorsByPatientId[patient.patient_id] || []) : []
    });
  });
}

async function createPatient(data) {
  const newPatientRecord = await patientModel.createPatient(data);
  // Devolver el paciente recién creado tal como está en la BD.
  // No hay necesidad de mapReferencePerson.
  const fullPatient = await patientModel.getPatientById(newPatientRecord.patient_id);
  return fullPatient;
}

async function updatePatient(id, data) {
  await patientModel.updatePatient(id, data);
  // Devolver el paciente actualizado.
  const updatedPatient = await patientModel.getPatientById(id);
  return updatedPatient;
}

async function deletePatient(id) {
  return await patientModel.deletePatient(id); // Sin cambios
}

async function getPatientById(id) {
  const patientRow = await patientModel.getPatientById(id);
  if (!patientRow) return null;

  // Obtener doctores y referencias por separado y añadirlos.
  const doctors = await getDoctorsForPatient(id);
  const references = await patientReferenceModel.getReferencesByPatientId(id);

  return { ...patientRow, doctors: doctors || [], reference_persons: references || [] };
}

async function getPatientWithReferences(id) {
  const patient = await patientModel.getPatientById(id);
  if (!patient) return null;
  
  // Obtener todas las obras sociales del paciente
  const patientHealthInsuranceModel = require('../models/patientHealthInsuranceModel');
  const healthInsurances = await patientHealthInsuranceModel.getPatientHealthInsurances(id);
  
  // Obtener la obra social principal (para compatibilidad)
  const primaryInsurance = healthInsurances.find(hi => hi.is_primary) || healthInsurances[0] || null;
  
  const references = await patientReferenceModel.getReferencesByPatientId(id);
  const doctors = await getDoctorsForPatient(id);
  
  return { 
    ...patient,
    reference_persons: references || [],
    doctors: doctors || [],
    health_insurances: healthInsurances || [],
    // Mantener compatibilidad con el sistema anterior
    health_insurance_id: primaryInsurance?.insurance_id || patient.health_insurance_id,
    health_insurance_member_number: primaryInsurance?.member_number || patient.health_insurance_member_number,
    health_insurance_name: primaryInsurance?.insurance_name || null,
    health_insurance: primaryInsurance ? {
      insurance_id: primaryInsurance.insurance_id,
      name: primaryInsurance.insurance_name,
      address: primaryInsurance.insurance_address,
      phone: primaryInsurance.insurance_phone,
      email: primaryInsurance.insurance_email
    } : null
  };
}

async function createPatientWithDoctors(data) {
  // patientModel.createPatient ya no maneja reference_person
  const newPatientBase = await patientModel.createPatient(data);

  if (Array.isArray(data.doctor_ids) && data.doctor_ids.length > 0) {
    await patientModel.addDoctorsToPatient(newPatientBase.patient_id, data.doctor_ids);
  }

  // Obtener el paciente completo con sus doctores y referencias para devolverlo
  return getPatientWithReferences(newPatientBase.patient_id);
}

async function updatePatientDoctors(patient_id, doctor_ids) {
  await patientModel.removeAllDoctorsFromPatient(patient_id);
  if (Array.isArray(doctor_ids) && doctor_ids.length > 0) {
    await patientModel.addDoctorsToPatient(patient_id, doctor_ids);
  }
}

async function addDoctorToPatient(patient_id, doctor_ids) {
  if (!Array.isArray(doctor_ids)) return;
  for (const doctor_id of doctor_ids) {
    await patientModel.addDoctorsToPatient(patient_id, [doctor_id]);
  }
}

async function removeDoctorFromPatient(patient_id, doctor_id) {
  await patientModel.removeDoctorFromPatient(patient_id, doctor_id);
}

// Nueva función para obtener doctores de un paciente
async function getDoctorsForPatient(patient_id) {
  try {
    const [rows] = await pool.query(`
      SELECT d.* 
      FROM doctors d 
      INNER JOIN patient_doctors pd ON d.doctor_id = pd.doctor_id 
      WHERE pd.patient_id = ?
      ORDER BY d.last_name, d.first_name
    `, [patient_id]);
    return rows;
  } catch (error) {
    debugPatients('Error en getDoctorsForPatient:', error);
    return [];
  }
}

async function getDashboardStats() {
  debugPatients('getDashboardStats llamado');
  try {
    debugPatients('Llamando a patientModel.countPatients()');
    const totalPacientes = await patientModel.countPatients();
    debugPatients('Total pacientes obtenido:', totalPacientes);
    const result = { totalPacientes };
    debugPatients('Resultado final:', result);
    return result;
  } catch (error) {
    debugPatients('Error en getDashboardStats:', error);
    throw error;
  }
}

async function getSearchStats(query) {
  try {
    const { sql, params } = buildPersonFilters(query);
    const countQuery = `SELECT COUNT(*) as total FROM patients ${sql}`;
    const [countRows] = await pool.query(countQuery, params);
    
    return {
      total: countRows[0].total,
      filters: Object.keys(query).filter(key => query[key] && query[key].trim())
    };
  } catch (error) {
    debugPatients('Error en getSearchStats:', error);
    throw error;
  }
}

async function getPatientsByDoctor(doctorId) {
  try {
    const query = `
      SELECT p.* 
      FROM patients p 
      INNER JOIN patient_doctors pd ON p.patient_id = pd.patient_id 
      WHERE pd.doctor_id = ?
    `;
    const [rows] = await pool.query(query, [doctorId]);
    return rows;
  } catch (error) {
    debugPatients('Error en getPatientsByDoctor:', error);
    throw error;
  }
}

async function getPatientsByHealthInsurance(insuranceId) {
  try {
    const query = `
      SELECT p.* 
      FROM patients p 
      WHERE p.health_insurance_id = ?
    `;
    const [rows] = await pool.query(query, [insuranceId]);
    return rows;
  } catch (error) {
    debugPatients('Error en getPatientsByHealthInsurance:', error);
    throw error;
  }
}

async function getFilterOptions() {
  try {
    // Obtener métodos de pago únicos
    const [paymentMethods] = await pool.query(`
      SELECT DISTINCT preferred_payment_methods 
      FROM patients 
      WHERE preferred_payment_methods IS NOT NULL AND preferred_payment_methods != ''
    `);
    
    // Obtener relaciones de referencia únicas
    const [relationships] = await pool.query(`
      SELECT DISTINCT reference_relationship 
      FROM patients 
      WHERE reference_relationship IS NOT NULL AND reference_relationship != ''
    `);

    return {
      paymentMethods: paymentMethods.map(p => p.preferred_payment_methods),
      relationships: relationships.map(r => r.reference_relationship)
    };
  } catch (error) {
    debugPatients('Error en getFilterOptions:', error);
    throw error;
  }
}

module.exports = { 
  listPatients, 
  listPatientsWithFilters, 
  createPatient, 
  updatePatient, 
  deletePatient, 
  getPatientById, 
  getPatientWithReferences, 
  createPatientWithDoctors, 
  updatePatientDoctors, 
  addDoctorToPatient,
  removeDoctorFromPatient, 
  getDoctorsForPatient,
  getDashboardStats, 
  getSearchStats, 
  getPatientsByDoctor, 
  getPatientsByHealthInsurance, 
  getFilterOptions,
  getPatientReportData // Nueva función exportada
};

async function getPatientReportData(startDate, endDate, rangeKey) {
  const reportStats = await patientModel.getPatientReportStats(startDate, endDate, rangeKey);

  // Calcular growthPercentage
  // (newPatientsInPeriod / (totalActivePatientsAtStartOfPeriod)) * 100
  // totalActivePatientsAtStartOfPeriod = totalActivePatients (actual) - newPatientsInPeriod
  // Evitar división por cero si no había pacientes antes o si no hay nuevos pacientes.
  let growthPercentage = 0;
  const activeAtStart = reportStats.summary.totalActivePatients - reportStats.summary.newPatientsInPeriod;
  if (activeAtStart > 0 && reportStats.summary.newPatientsInPeriod > 0) {
    growthPercentage = (reportStats.summary.newPatientsInPeriod / activeAtStart) * 100;
  } else if (reportStats.summary.newPatientsInPeriod > 0) {
    // Si no había pacientes antes, pero hay nuevos, se considera un crecimiento "infinito" o 100% desde 0.
    // Para evitar 'Infinity', podemos mostrar 100% o un valor alto, o simplemente el número de nuevos.
    // El frontend espera un número para el trend, así que un 100% puede ser razonable.
    growthPercentage = 100;
  }

  return {
    summary: {
      ...reportStats.summary,
      growthPercentage: parseFloat(growthPercentage.toFixed(1))
    },
    byTimePeriod: reportStats.byTimePeriod,
    byAgeGroup: reportStats.byAgeGroup,
    // debug: reportStats.debug // Descomentar si se necesita debug en el frontend
  };
}