const consultationHourService = require('../services/doctorConsultationHourService');

async function getAll(req, res) {
  try {
    const hours = await consultationHourService.listConsultationHours();
    res.json(hours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    const hour = await consultationHourService.createConsultationHour(req.body);
    res.status(201).json(hour);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const hour = await consultationHourService.updateConsultationHour(req.params.id, req.body);
    res.json(hour);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    await consultationHourService.deleteConsultationHour(req.params.id);
    res.json({ message: 'Horario eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAll, create, update, remove }; 