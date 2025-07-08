const secretaryActivityModel = require('../models/secretaryActivityModel');

async function listSecretaryActivities(filters) {
  return await secretaryActivityModel.getAllSecretaryActivities(filters);
}

async function createSecretaryActivity(data) {
  return await secretaryActivityModel.createSecretaryActivity(data);
}

async function getSecretaryActivityReportData(startDate, endDate, rangeKey) {
  // Podríamos añadir lógica aquí para asegurar que todos los activity_type esperados
  // estén en la respuesta, incluso con 0, si fuera necesario.
  // Por ahora, el modelo ya devuelve una buena estructura.
  const reportData = await secretaryActivityModel.getSecretaryActivityReportStats(startDate, endDate, rangeKey);

  // Ejemplo: Si quisiéramos asegurar que ciertos tipos de actividad siempre aparezcan
  // const expectedActivityTypes = ['PATIENT_REGISTRATION', 'APPOINTMENT_SCHEDULE', 'OTHER_TYPE'];
  // const completeActivitiesByType = {
  //   ...expectedActivityTypes.reduce((acc, type) => ({...acc, [type]:0}), {}),
  //   ...reportData.activitiesByType
  // };
  // reportData.activitiesByType = completeActivitiesByType;

  return reportData;
}

module.exports = { listSecretaryActivities, createSecretaryActivity, getSecretaryActivityReportData };