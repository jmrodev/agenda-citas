const patientModel = require('../models/patientModel');

async function listPatients() {
  return await patientModel.getAllPatients();
}

async function createPatient(data) {
  return await patientModel.createPatient(data);
}

async function updatePatient(id, data) {
  return await patientModel.updatePatient(id, data);
}

async function deletePatient(id) {
  return await patientModel.deletePatient(id);
}

module.exports = { listPatients, createPatient, updatePatient, deletePatient }; 