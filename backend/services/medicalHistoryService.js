const medicalHistoryModel = require('../models/medicalHistoryModel');

async function listMedicalHistories() {
  return await medicalHistoryModel.getAllMedicalHistories();
}

async function listMedicalHistoriesWithFilters(query) {
  return await medicalHistoryModel.findMedicalHistoriesWithFilters(query);
}

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

module.exports = { listMedicalHistories, listMedicalHistoriesWithFilters, listMedicalHistory, createMedicalHistory, updateMedicalHistory, deleteMedicalHistory }; 