const healthInsuranceModel = require('../models/healthInsuranceModel');

async function listHealthInsurances(query) {
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

async function deleteHealthInsurance(id) {
  return await healthInsuranceModel.deleteHealthInsurance(id);
}

async function getHealthInsuranceById(id) {
  return await healthInsuranceModel.getHealthInsuranceById(id);
}

module.exports = { listHealthInsurances, listHealthInsurancesWithFilters, createHealthInsurance, updateHealthInsurance, deleteHealthInsurance, getHealthInsuranceById };