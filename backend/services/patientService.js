const patientModel = require('../models/patientModel');
const patientReferenceModel = require('../models/patientReferenceModel');
const { debugPatients } = require('../utils/debug');
const { buildPersonFilters } = require('../filters/sql/personFilters');
const pool = require('../config/db');

function mapReferencePerson(row) {
  const {
    reference_name,
    reference_last_name,
    reference_address,
    reference_phone,
    reference_relationship,
    ...rest
  } = row;
  return {
    ...rest,
    reference_person: {
      name: reference_name,
      last_name: reference_last_name,
      address: reference_address,
      phone: reference_phone,
      relationship: reference_relationship
    }
  };
}

async function listPatients(query, user) {
  // Si se pasa doctor_id por query, filtrar por ese doctor
  if (query.doctor_id) {
    const rows = await patientModel.getAllPatients();
    const patients = [];
    for (const row of rows) {
      const doctorIds = await patientModel.getDoctorsByPatientId(row.patient_id);
      if (doctorIds.includes(Number(query.doctor_id))) {
        const references = await patientReferenceModel.getReferencesByPatientId(row.patient_id);
        const doctors = await getDoctorsForPatient(row.patient_id);
        patients.push({ ...row, reference_persons: references, doctors });
      }
    }
    return patients;
  }
  // Si es doctor autenticado, filtrar por su propio id
  if (user && user.role === 'doctor') {
    const rows = await patientModel.getAllPatients();
    const patients = [];
    for (const row of rows) {
      const doctorIds = await patientModel.getDoctorsByPatientId(row.patient_id);
      if (doctorIds.includes(user.entity_id)) {
        const references = await patientReferenceModel.getReferencesByPatientId(row.patient_id);
        const doctors = await getDoctorsForPatient(row.patient_id);
        patients.push({ ...row, reference_persons: references, doctors });
      }
    }
    return patients;
  }
  // Secretaria/admin: todos los pacientes
  const rows = await patientModel.getAllPatients();
  const patients = await Promise.all(rows.map(async (row) => {
    const references = await patientReferenceModel.getReferencesByPatientId(row.patient_id);
    const doctors = await getDoctorsForPatient(row.patient_id);
    // ...patient, // Ya no necesitamos esparcir patient aquí si mapReferencePerson lo hace
    ...mapReferencePerson(patient), // Asegurarse que la referencia_person anidada esté
    reference_persons: referencesByPatientId[patient.patient_id] || [], // Lista de otras referencias
    doctors: doctorsByPatientId[patient.patient_id] || []
  }));
}


async function listPatients(query, user) {
  let effectiveQuery = { ...query };

  // Lógica de roles para modificar la query
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
  const patientIds = basePatients.map(p => p.patient_id);

  const [doctorsByPatientId, referencesByPatientId] = await Promise.all([
    patientModel.getDoctorsForPatientIds(patientIds),
    patientReferenceModel.getReferencesByPatientIds(patientIds)
  ]);

  return basePatients.map(patient => ({
    ...mapReferencePerson(patient), // mapReferencePerson ya incluye ...rest del paciente
    reference_persons: referencesByPatientId[patient.patient_id] || [],
    doctors: doctorsByPatientId[patient.patient_id] || []
  }));
}

async function createPatient(data) {
  const patient = await patientModel.createPatient(data);
  const fullPatient = await patientModel.getPatientById(patient.patient_id);
  return mapReferencePerson(fullPatient);
}

async function updatePatient(id, data) {
  await patientModel.updatePatient(id, data);
  const fullPatient = await patientModel.getPatientById(id);
  return mapReferencePerson(fullPatient);
}

async function deletePatient(id) {
  return await patientModel.deletePatient(id);
}

async function getPatientById(id) {
  const row = await patientModel.getPatientById(id);
  if (!row) return null;
  const doctors = await getDoctorsForPatient(id);
  return { ...mapReferencePerson(row), doctors };
}

async function getPatientWithReferences(id) {
  const patient = await patientModel.getPatientById(id);
  if (!patient) return null;
  
  // Obtener información completa de la obra social
  let healthInsurance = null;
  if (patient.health_insurance_id) {
    try {
      const [rows] = await pool.query(
        'SELECT insurance_id, name, address, phone, email FROM health_insurances WHERE insurance_id = ?',
        [patient.health_insurance_id]
      );
      if (rows.length > 0) {
        healthInsurance = rows[0];
      }
    } catch (error) {
      console.error('Error obteniendo obra social:', error);
    }
  }
  
  const references = await patientReferenceModel.getReferencesByPatientId(id);
  const doctors = await getDoctorsForPatient(id);
  
  return { 
    ...mapReferencePerson(patient), 
    reference_persons: references, 
    doctors,
    health_insurance_name: healthInsurance?.name || null,
    health_insurance: healthInsurance || null
  };
}

async function createPatientWithDoctors(data) {
  // Crear paciente
  const patient = await patientModel.createPatient(data);
  // Asociar doctores
  if (Array.isArray(data.doctor_ids) && data.doctor_ids.length > 0) {
    await patientModel.addDoctorsToPatient(patient.patient_id, data.doctor_ids);
  }
  const fullPatient = await patientModel.getPatientById(patient.patient_id);
  const doctors = await getDoctorsForPatient(patient.patient_id);
  return { ...mapReferencePerson(fullPatient), doctors };
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
  getFilterOptions 
}; 