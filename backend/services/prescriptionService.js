const PrescriptionModel = require('../models/entities/prescriptionModel');

async function listPrescriptions() {
  return await PrescriptionModel.findAll();
}

async function listPrescriptionsWithFilters(query) {
  return await PrescriptionModel.findPrescriptionsWithFilters(query);
}

async function getPrescriptionById(id) {
  return await PrescriptionModel.findById(id);
}

async function createPrescription(data) {
  return await PrescriptionModel.create(data);
}

async function updatePrescription(id, data) {
  await PrescriptionModel.update(id, data);
  return await PrescriptionModel.findById(id);
}

async function deletePrescription(id) {
  return await PrescriptionModel.delete(id);
}

module.exports = { listPrescriptions, listPrescriptionsWithFilters, getPrescriptionById, createPrescription, updatePrescription, deletePrescription };
