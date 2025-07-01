const healthInsuranceService = require('../services/healthInsuranceService');

async function getAll(req, res) {
  try {
    const insurances = await healthInsuranceService.listHealthInsurances();
    res.json(insurances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAllWithFilters(req, res) {
  try {
    const insurances = await healthInsuranceService.listHealthInsurancesWithFilters(req.query);
    res.json(insurances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    const insurance = await healthInsuranceService.createHealthInsurance(req.body);
    res.status(201).json(insurance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const insurance = await healthInsuranceService.updateHealthInsurance(req.params.id, req.body);
    res.json(insurance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    await healthInsuranceService.deleteHealthInsurance(req.params.id);
    res.json({ message: 'Obra social eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAll, getAllWithFilters, create, update, remove }; 