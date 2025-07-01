const patientModel = require('../models/patientModel');
const patientReferenceModel = require('../models/patientReferenceModel');

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

async function listPatients() {
  const rows = await patientModel.getAllPatients();
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

module.exports = { listPatients, createPatient, updatePatient, deletePatient, getPatientById, getPatientWithReferences }; 