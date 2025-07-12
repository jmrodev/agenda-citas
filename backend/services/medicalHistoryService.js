const MedicalHistoryModel = require('../models/entities/medicalHistoryModel');

async function listMedicalHistories() {
  return await MedicalHistoryModel.findAll();
}

async function listMedicalHistoriesWithFilters(query) {
  return await MedicalHistoryModel.findMedicalHistoriesWithFilters(query);
}

async function createMedicalHistory(data) {
  return await MedicalHistoryModel.create(data);
}

async function updateMedicalHistory(id, data) {
  await MedicalHistoryModel.update(id, data);
  return await MedicalHistoryModel.findById(id);
}

async function deleteMedicalHistory(id) {
  return await MedicalHistoryModel.delete(id);
}

async function getMedicalHistoryReportData(startDate, endDate) {
  return await MedicalHistoryModel.getMedicalHistoryReportStats(startDate, endDate);
}

module.exports = { listMedicalHistories, listMedicalHistoriesWithFilters, createMedicalHistory, updateMedicalHistory, deleteMedicalHistory, getMedicalHistoryReportData };
