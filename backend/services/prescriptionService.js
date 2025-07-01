const prescriptionModel = require('../models/prescriptionModel');

async function listPrescriptions() {
  return await prescriptionModel.getAllPrescriptions();
}

async function listPrescriptionsWithFilters(query) {
  return await prescriptionModel.findPrescriptionsWithFilters(query);
}

async function getPrescriptionById(id) {
  const [prescription] = await prescriptionModel.getPrescriptionById(id);
  return prescription;
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

module.exports = { listPrescriptions, listPrescriptionsWithFilters, getPrescriptionById, createPrescription, updatePrescription, deletePrescription }; 