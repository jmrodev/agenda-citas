const secretaryActivityService = require('../services/secretaryActivityService');
const { parseAndValidateDate } = require('../utils/date');

async function getAll(req, res) {
  try {
    const filters = {
      secretary_id: req.query.secretary_id,
      date: req.query.date,
      date_from: req.query.date_from,
      date_to: req.query.date_to,
      activity_type: req.query.activity_type,
      activity_types: req.query.activity_types,
      activity_id: req.query.activity_id,
      detail: req.query.detail,
      time_from: req.query.time_from,
      time_to: req.query.time_to
    };
    const activities = await secretaryActivityService.listSecretaryActivities(filters);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    let data = { ...req.body };
    if (data.date && typeof data.date === 'object') {
      try {
        data.date = parseAndValidateDate(data.date, 'date', true);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    } else if (data.date) {
      return res.status(400).json({ error: 'date debe ser un objeto { day, month, year }' });
    }
    const activity = await secretaryActivityService.createSecretaryActivity(data);
    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    let data = { ...req.body };
    if (data.date && typeof data.date === 'object') {
      try {
        data.date = parseAndValidateDate(data.date, 'date', true);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    } else if (data.date) {
      return res.status(400).json({ error: 'date debe ser un objeto { day, month, year }' });
    }
    const activity = await secretaryActivityService.updateSecretaryActivity(req.params.id, data);
    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getSecretaryActivityReportSummary(req, res) {
  try {
    const { startDate, endDate, rangeKey } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Los parámetros startDate y endDate son requeridos.' });
    }

    const reportData = await secretaryActivityService.getSecretaryActivityReportData(startDate, endDate, rangeKey);
    res.json(reportData);
  } catch (err) {
    console.error('Error en getSecretaryActivityReportSummary:', err);
    res.status(500).json({ error: 'Error al obtener el resumen del reporte de actividad de secretarias: ' + err.message });
  }
}

module.exports = { getAll, create, update, getSecretaryActivityReportSummary };