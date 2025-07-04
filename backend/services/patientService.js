const patientModel = require('../models/patientModel');
const patientReferenceModel = require('../models/patientReferenceModel');
const { debugPatients } = require('../utils/debug');

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
        patients.push({ ...row, reference_persons: references });
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
        patients.push({ ...row, reference_persons: references });
      }
    }
    return patients;
  }
  // Secretaria/admin: todos los pacientes
  const rows = await patientModel.getAllPatients();
  const patients = await Promise.all(rows.map(async (row) => {
    const references = await patientReferenceModel.getReferencesByPatientId(row.patient_id);
    return { ...row, reference_persons: references };
  }));
  return patients;
}

async function listPatientsWithFilters(query) {
  const rows = await patientModel.findPatientsWithFilters(query);
  const patients = await Promise.all(rows.map(async (row) => {
    const references = await patientReferenceModel.getReferencesByPatientId(row.patient_id);
    return { ...row, reference_persons: references };
  }));
  return patients;
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
  return mapReferencePerson(row);
}

async function getPatientWithReferences(id) {
  const patient = await patientModel.getPatientById(id);
  if (!patient) return null;
  const references = await patientReferenceModel.getReferencesByPatientId(id);
  return { ...patient, reference_persons: references };
}

async function createPatientWithDoctors(data) {
  // Crear paciente
  const patient = await patientModel.createPatient(data);
  // Asociar doctores
  if (Array.isArray(data.doctor_ids) && data.doctor_ids.length > 0) {
    await patientModel.addDoctorsToPatient(patient.patient_id, data.doctor_ids);
  }
  const fullPatient = await patientModel.getPatientById(patient.patient_id);
  return mapReferencePerson(fullPatient);
}

async function updatePatientDoctors(patient_id, doctor_ids) {
  await patientModel.removeAllDoctorsFromPatient(patient_id);
  if (Array.isArray(doctor_ids) && doctor_ids.length > 0) {
    await patientModel.addDoctorsToPatient(patient_id, doctor_ids);
  }
}

async function removeDoctorFromPatient(patient_id, doctor_id) {
  await patientModel.removeDoctorFromPatient(patient_id, doctor_id);
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

module.exports = { listPatients, listPatientsWithFilters, createPatient, updatePatient, deletePatient, getPatientById, getPatientWithReferences, createPatientWithDoctors, updatePatientDoctors, removeDoctorFromPatient, getDashboardStats }; 