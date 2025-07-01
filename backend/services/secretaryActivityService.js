const secretaryActivityModel = require('../models/secretaryActivityModel');

async function listSecretaryActivities() {
  return await secretaryActivityModel.getAllSecretaryActivities();
}

async function createSecretaryActivity(data) {
  return await secretaryActivityModel.createSecretaryActivity(data);
}

async function updateSecretaryActivity(id, data) {
  return await secretaryActivityModel.updateSecretaryActivity(id, data);
}

async function deleteSecretaryActivity(id) {
  return await secretaryActivityModel.deleteSecretaryActivity(id);
}

module.exports = { listSecretaryActivities, createSecretaryActivity, updateSecretaryActivity, deleteSecretaryActivity }; 