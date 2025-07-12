const HealthInsuranceModel = require('../models/entities/healthInsuranceModel');

async function listHealthInsurances() {
  return await HealthInsuranceModel.findAll();
}

async function listHealthInsurancesWithFilters(query) {
  return await HealthInsuranceModel.findWithFilters(query);
}

async function createHealthInsurance(data) {
  return await HealthInsuranceModel.create(data);
}

async function updateHealthInsurance(id, data) {
  await HealthInsuranceModel.update(id, data);
  return await HealthInsuranceModel.findById(id);
}

async function deleteHealthInsurance(id, action = 'delete') {
  return await HealthInsuranceModel.deleteHealthInsurance(id, action);
}

async function getHealthInsuranceById(id) {
  return await HealthInsuranceModel.findById(id);
}

async function getHealthInsuranceReferences(id) {
  console.log('🔍 [HealthInsuranceService] getHealthInsuranceReferences llamado con ID:', id);
  const result = await HealthInsuranceModel.getHealthInsuranceReferences(id);
  console.log('🔍 [HealthInsuranceService] Resultado del modelo:', result);
  return result;
}

module.exports = { listHealthInsurances, listHealthInsurancesWithFilters, createHealthInsurance, updateHealthInsurance, deleteHealthInsurance, getHealthInsuranceById, getHealthInsuranceReferences };