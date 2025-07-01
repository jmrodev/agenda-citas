const healthInsuranceService = require('../services/healthInsuranceService');

async function getAll(req, res) {
  try {
    const insurances = await healthInsuranceService.listHealthInsurances();
    res.json(insurances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAll }; 