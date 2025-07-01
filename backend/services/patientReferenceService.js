const patientReferenceModel = require('../models/patientReferenceModel');

async function listReferencePersons(patient_id) {
  return await patientReferenceModel.getReferencesByPatientId(patient_id);
}

async function listReferencePersonsWithFilters(query) {
  return await patientReferenceModel.findReferencePersonsWithFilters(query);
}

// ...otros métodos existentes...

module.exports = { listReferencePersons, listReferencePersonsWithFilters /*, otros métodos existentes */ }; 