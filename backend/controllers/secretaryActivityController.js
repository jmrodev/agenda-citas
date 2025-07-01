const secretaryActivityService = require('../services/secretaryActivityService');

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
    const activity = await secretaryActivityService.createSecretaryActivity(req.body);
    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAll, create }; 