const patientService = require('../services/patientService');

async function getAll(req, res) {
  try {
    const patients = await patientService.listPatients();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAll }; 