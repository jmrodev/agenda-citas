const patientModel = require('../models/patientModel');

async function listPatients() {
  return await patientModel.getAllPatients();
}

module.exports = { listPatients }; 