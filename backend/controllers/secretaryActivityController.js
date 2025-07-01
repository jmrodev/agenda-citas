const secretaryActivityService = require('../services/secretaryActivityService');

async function getAll(req, res) {
  try {
    const activities = await secretaryActivityService.listSecretaryActivities();
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAll }; 