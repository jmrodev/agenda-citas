const medicalHistoryModel = require('../models/medicalHistoryModel');

async function listMedicalHistory() {
  return await medicalHistoryModel.getAllMedicalHistory();
}

module.exports = { listMedicalHistory }; 