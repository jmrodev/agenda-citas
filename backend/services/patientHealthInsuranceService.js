const patientHealthInsuranceModel = require('../models/patientHealthInsuranceModel');

async function getPatientHealthInsurances(patientId) {
  return await patientHealthInsuranceModel.getPatientHealthInsurances(patientId);
}

async function addHealthInsuranceToPatient(patientId, insuranceId, memberNumber = null, isPrimary = false) {
  return await patientHealthInsuranceModel.addHealthInsuranceToPatient(patientId, insuranceId, memberNumber, isPrimary);
}

async function updatePatientHealthInsurance(patientInsuranceId, data) {
  return await patientHealthInsuranceModel.updatePatientHealthInsurance(patientInsuranceId, data);
}

async function removeHealthInsuranceFromPatient(patientInsuranceId) {
  return await patientHealthInsuranceModel.removeHealthInsuranceFromPatient(patientInsuranceId);
}

async function getPrimaryHealthInsurance(patientId) {
  return await patientHealthInsuranceModel.getPrimaryHealthInsurance(patientId);
}

async function setPrimaryHealthInsurance(patientId, insuranceId) {
  return await patientHealthInsuranceModel.setPrimaryHealthInsurance(patientId, insuranceId);
}

module.exports = {
  getPatientHealthInsurances,
  addHealthInsuranceToPatient,
  updatePatientHealthInsurance,
  removeHealthInsuranceFromPatient,
  getPrimaryHealthInsurance,
  setPrimaryHealthInsurance
}; 