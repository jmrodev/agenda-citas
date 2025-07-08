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
    const action = req.body.action || 'delete';
    await healthInsuranceService.deleteHealthInsurance(req.params.id, action);
    res.json({ message: 'Obra social eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getById(req, res) {
  try {
    const insurance = await healthInsuranceService.getHealthInsuranceById(req.params.id);
    if (!insurance) {
      return res.status(404).json({ error: 'Obra social no encontrada' });
    }
    res.json(insurance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getReferences(req, res) {
  try {
    console.log('🔍 [HealthInsuranceController] getReferences llamado con ID:', req.params.id);
    const references = await healthInsuranceService.getHealthInsuranceReferences(req.params.id);
    console.log('🔍 [HealthInsuranceController] Referencias obtenidas:', references);
    res.json(references);
  } catch (err) {
    console.error('❌ [HealthInsuranceController] Error en getReferences:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAll, getAllWithFilters, create, update, remove, getById, getReferences };