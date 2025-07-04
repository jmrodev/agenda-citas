const doctorService = require('../services/doctorService');
const { parseAndValidateDate } = require('../utils/date');

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
    let data = { ...req.body };
    if (data.last_earnings_collection_date && typeof data.last_earnings_collection_date === 'object') {
      try {
        data.last_earnings_collection_date = parseAndValidateDate(data.last_earnings_collection_date, 'last_earnings_collection_date', true);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    } else if (data.last_earnings_collection_date) {
      return res.status(400).json({ error: 'last_earnings_collection_date debe ser un objeto { day, month, year }' });
    }
    const doctor = await doctorService.createDoctor(data);
    res.status(201).json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    let data = { ...req.body };
    if (data.last_earnings_collection_date && typeof data.last_earnings_collection_date === 'object') {
      try {
        data.last_earnings_collection_date = parseAndValidateDate(data.last_earnings_collection_date, 'last_earnings_collection_date', true);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    } else if (data.last_earnings_collection_date) {
      return res.status(400).json({ error: 'last_earnings_collection_date debe ser un objeto { day, month, year }' });
    }
    const doctor = await doctorService.updateDoctor(req.params.id, data);
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

async function getById(req, res) {
  try {
    const doctor = await doctorService.getDoctorById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor no encontrado' });
    }
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAll, create, update, remove, getDashboardStats, getById }; 