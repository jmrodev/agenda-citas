const prescriptionModel = require('../models/prescriptionModel');

async function listPrescriptions() {
  return await prescriptionModel.getAllPrescriptions();
}

module.exports = { listPrescriptions }; 