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
    // req.body ya validado por Joi (createSecretaryActivitySchema)
    const activityData = req.body;
    const activity = await secretaryActivityService.createSecretaryActivity(activityData);
    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// La función update no está actualmente en uso por ninguna ruta, pero si se usara, se simplificaría así:
/*
async function update(req, res) {
  try {
    // req.body ya validado por Joi (updateSecretaryActivitySchema)
    const activityData = req.body;
    const activity = await secretaryActivityService.updateSecretaryActivity(req.params.id, activityData);
    if (!activity) {
        return res.status(404).json({ error: 'Actividad no encontrada para actualizar.' });
    }
    res.json(activity);
  } catch (err) {
    if (err.message.toLowerCase().includes('not found')) {
        return res.status(404).json({ error: 'Actividad no encontrada.' });
    }
    res.status(500).json({ error: err.message });
  }
}
*/

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