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
    const prescription = await prescriptionService.getPrescriptionById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }
    const createdDate = new Date(prescription.date);
    const now = new Date();
    const diffDays = (now - createdDate) / (1000 * 60 * 60 * 24);
    if (diffDays > 7) {
      return res.status(403).json({ error: 'No se puede modificar la receta después de una semana' });
    }
    const updated = await prescriptionService.updatePrescription(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    const prescription = await prescriptionService.getPrescriptionById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }
    const createdDate = new Date(prescription.date);
    const now = new Date();
    const diffDays = (now - createdDate) / (1000 * 60 * 60 * 24);
    if (diffDays > 7) {
      return res.status(403).json({ error: 'No se puede eliminar la receta después de una semana' });
    }
    await prescriptionService.deletePrescription(req.params.id);
    res.json({ message: 'Receta eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAll, create, update, remove }; 