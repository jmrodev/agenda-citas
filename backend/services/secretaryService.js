const secretaryModel = require('../models/secretaryModel');

async function createSecretary(data) {
  return await secretaryModel.createSecretary(data);
}

async function getDashboardStats() {
  const rows = await secretaryModel.getAllSecretaries();
  return { totalSecretarias: rows.length };
}

module.exports = { createSecretary, getDashboardStats }; 