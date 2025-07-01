const secretaryActivityService = require('../services/secretaryActivityService');

async function getAll(req, res) {
  try {
    const activities = await secretaryActivityService.listSecretaryActivities();
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

async function update(req, res) {
  try {
    const activity = await secretaryActivityService.updateSecretaryActivity(req.params.id, req.body);
    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    await secretaryActivityService.deleteSecretaryActivity(req.params.id);
    res.json({ message: 'Actividad eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAll, create, update, remove }; 