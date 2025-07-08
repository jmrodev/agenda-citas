const healthInsuranceModel = require('../models/healthInsuranceModel');

async function listHealthInsurances() {
  return await healthInsuranceModel.getAllHealthInsurances();
}

async function listHealthInsurancesWithFilters(query) {
  return await healthInsuranceModel.findHealthInsurancesWithFilters(query);
}

async function createHealthInsurance(data) {
  return await healthInsuranceModel.createHealthInsurance(data);
}

async function updateHealthInsurance(id, data) {
  return await healthInsuranceModel.updateHealthInsurance(id, data);
}

async function deleteHealthInsurance(id, action = 'delete') {
  return await healthInsuranceModel.deleteHealthInsurance(id, action);
}

async function getHealthInsuranceById(id) {
  return await healthInsuranceModel.getHealthInsuranceById(id);
}

async function getHealthInsuranceReferences(id) {
  console.log('🔍 [HealthInsuranceService] getHealthInsuranceReferences llamado con ID:', id);
  const result = await healthInsuranceModel.getHealthInsuranceReferences(id);
  console.log('🔍 [HealthInsuranceService] Resultado del modelo:', result);
  return result;
}

module.exports = { listHealthInsurances, listHealthInsurancesWithFilters, createHealthInsurance, updateHealthInsurance, deleteHealthInsurance, getHealthInsuranceById, getHealthInsuranceReferences };