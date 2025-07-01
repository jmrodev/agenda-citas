const prescriptionService = require('../services/prescriptionService');

async function getAll(req, res) {
  try {
    const prescriptions = await prescriptionService.listPrescriptions();
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    const prescription = await prescriptionService.createPrescription(req.body);
    res.status(201).json(prescription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const prescription = await prescriptionService.updatePrescription(req.params.id, req.body);
    res.json(prescription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    await prescriptionService.deletePrescription(req.params.id);
    res.json({ message: 'Receta eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAll, create, update, remove }; 