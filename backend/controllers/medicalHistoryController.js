const medicalHistoryService = require('../services/medicalHistoryService');

async function getAll(req, res) {
  try {
    const history = await medicalHistoryService.listMedicalHistory();
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    const record = await medicalHistoryService.createMedicalHistory(req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const record = await medicalHistoryService.updateMedicalHistory(req.params.id, req.body);
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    await medicalHistoryService.deleteMedicalHistory(req.params.id);
    res.json({ message: 'Registro de historial médico eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAll, create, update, remove }; 