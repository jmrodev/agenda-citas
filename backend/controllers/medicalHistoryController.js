const medicalHistoryService = require('../services/medicalHistoryService');

async function getAll(req, res) {
  try {
    const history = await medicalHistoryService.listMedicalHistory();
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAll }; 