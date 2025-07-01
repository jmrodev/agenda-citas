const secretaryActivityModel = require('../models/secretaryActivityModel');

async function listSecretaryActivities() {
  return await secretaryActivityModel.getAllSecretaryActivities();
}

module.exports = { listSecretaryActivities }; 