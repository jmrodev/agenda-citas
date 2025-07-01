const medicalHistoryModel = require('../models/medicalHistoryModel');

async function listMedicalHistory() {
  return await medicalHistoryModel.getAllMedicalHistory();
}

async function createMedicalHistory(data) {
  return await medicalHistoryModel.createMedicalHistory(data);
}

async function updateMedicalHistory(id, data) {
  return await medicalHistoryModel.updateMedicalHistory(id, data);
}

async function deleteMedicalHistory(id) {
  return await medicalHistoryModel.deleteMedicalHistory(id);
}

module.exports = { listMedicalHistory, createMedicalHistory, updateMedicalHistory, deleteMedicalHistory }; 