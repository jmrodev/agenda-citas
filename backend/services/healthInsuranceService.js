const healthInsuranceModel = require('../models/healthInsuranceModel');

async function listHealthInsurances() {
  return await healthInsuranceModel.getAllHealthInsurances();
}

module.exports = { listHealthInsurances }; 