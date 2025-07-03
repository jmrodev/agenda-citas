const doctorService = require('../services/doctorService');

async function getAll(req, res) {
  try {
    const doctors = await doctorService.listDoctors();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    const doctor = await doctorService.createDoctor(req.body);
    res.status(201).json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const doctor = await doctorService.updateDoctor(req.params.id, req.body);
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    await doctorService.deleteDoctor(req.params.id);
    res.json({ message: 'Doctor eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDashboardStats(req, res) {
  try {
    const stats = await doctorService.getDashboardStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener estadísticas de doctores' });
  }
}

module.exports = { getAll, create, update, remove, getDashboardStats }; 