const PatientHealthInsuranceModel = require('../models/relations/patientHealthInsuranceModel');

async function getPatientHealthInsurances(patientId) {
  return await PatientHealthInsuranceModel.getPatientHealthInsurances(patientId);
}

async function addHealthInsuranceToPatient(patientId, insuranceId, memberNumber = null, isPrimary = false) {
  return await PatientHealthInsuranceModel.addHealthInsuranceToPatient(patientId, insuranceId, memberNumber, isPrimary);
}

async function updatePatientHealthInsurance(patientInsuranceId, data) {
  return await PatientHealthInsuranceModel.updatePatientHealthInsurance(patientInsuranceId, data);
}

async function removeHealthInsuranceFromPatient(patientInsuranceId) {
  return await PatientHealthInsuranceModel.removeHealthInsuranceFromPatient(patientInsuranceId);
}

async function getPrimaryHealthInsurance(patientId) {
  return await PatientHealthInsuranceModel.getPrimaryHealthInsurance(patientId);
}

async function setPrimaryHealthInsurance(patientId, insuranceId) {
  return await PatientHealthInsuranceModel.setPrimaryHealthInsurance(patientId, insuranceId);
}

module.exports = {
  getPatientHealthInsurances,
  addHealthInsuranceToPatient,
  updatePatientHealthInsurance,
  removeHealthInsuranceFromPatient,
  getPrimaryHealthInsurance,
  setPrimaryHealthInsurance
};
