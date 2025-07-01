const prescriptionService = require('../services/prescriptionService');

async function getAll(req, res) {
  try {
    const prescriptions = await prescriptionService.listPrescriptions();
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAll }; 