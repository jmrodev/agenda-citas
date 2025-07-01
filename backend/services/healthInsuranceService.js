const healthInsuranceModel = require('../models/healthInsuranceModel');

async function listHealthInsurances() {
  return await healthInsuranceModel.getAllHealthInsurances();
}

async function createHealthInsurance(data) {
  return await healthInsuranceModel.createHealthInsurance(data);
}

async function updateHealthInsurance(id, data) {
  return await healthInsuranceModel.updateHealthInsurance(id, data);
}

async function deleteHealthInsurance(id) {
  return await healthInsuranceModel.deleteHealthInsurance(id);
}

module.exports = { listHealthInsurances, createHealthInsurance, updateHealthInsurance, deleteHealthInsurance }; 