const prescriptionModel = require('../models/prescriptionModel');

async function listPrescriptions() {
  return await prescriptionModel.getAllPrescriptions();
}

async function createPrescription(data) {
  return await prescriptionModel.createPrescription(data);
}

async function updatePrescription(id, data) {
  return await prescriptionModel.updatePrescription(id, data);
}

async function deletePrescription(id) {
  return await prescriptionModel.deletePrescription(id);
}

module.exports = { listPrescriptions, createPrescription, updatePrescription, deletePrescription }; 