const appointmentService = require('../services/appointmentService');

async function getAll(req, res) {
  try {
    const appointments = await appointmentService.listAppointments();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAllWithFilters(req, res) {
  try {
    const appointments = await appointmentService.listAppointmentsWithFilters(req.query);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    const appointment = await appointmentService.createAppointment(req.body);
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const appointment = await appointmentService.updateAppointment(req.params.id, req.body);
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    await appointmentService.deleteAppointment(req.params.id);
    res.json({ message: 'Cita eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getMyAppointments(req, res) {
  try {
    const patientId = req.user.entity_id;
    const appointments = await appointmentService.getAppointmentsByPatientId(patientId);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDashboardStats(req, res) {
  try {
    const stats = await appointmentService.getDashboardStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener estadísticas de citas' });
  }
}

module.exports = { getAll, getAllWithFilters, create, update, remove, getMyAppointments, getDashboardStats }; 