const SecretaryActivityModel = require('../models/entities/secretaryActivityModel');

async function listSecretaryActivities(filters) {
  return await SecretaryActivityModel.getAllSecretaryActivities(filters);
}

async function createSecretaryActivity(data) {
  return await SecretaryActivityModel.create(data);
}

async function getSecretaryActivityReportData(startDate, endDate, rangeKey) {
  const reportData = await SecretaryActivityModel.getSecretaryActivityReportStats(startDate, endDate, rangeKey);
  return reportData;
}

module.exports = { listSecretaryActivities, createSecretaryActivity, getSecretaryActivityReportData };