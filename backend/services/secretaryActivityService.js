const secretaryActivityModel = require('../models/secretaryActivityModel');

async function listSecretaryActivities(filters) {
  return await secretaryActivityModel.getAllSecretaryActivities(filters);
}

async function createSecretaryActivity(data) {
  return await secretaryActivityModel.createSecretaryActivity(data);
}

module.exports = { listSecretaryActivities, createSecretaryActivity }; 