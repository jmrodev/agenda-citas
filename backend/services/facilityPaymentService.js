const facilityPaymentModel = require('../models/facilityPaymentModel');

async function getDashboardStats() {
  const totalPayments = await facilityPaymentModel.getTotalPayments();
  return { totalPagos: totalPayments };
}

async function getPaymentsStats() {
  return await facilityPaymentModel.getPaymentsStats();
}

async function getPaymentsByDoctorStats() {
  return await facilityPaymentModel.getPaymentsByDoctorStats();
}

async function getAllPayments() {
  return await facilityPaymentModel.getAllPayments();
}

async function getPaymentsByDateRange(dateFrom, dateTo) {
  return await facilityPaymentModel.getPaymentsByDateRange(dateFrom, dateTo);
}

async function getPaymentsByDoctor(doctorId) {
  return await facilityPaymentModel.getPaymentsByDoctor(doctorId);
}

module.exports = { 
  getDashboardStats, 
  getPaymentsStats, 
  getPaymentsByDoctorStats,
  getAllPayments,
  getPaymentsByDateRange,
  getPaymentsByDoctor,
  getPaymentReportData // Nueva función exportada
};

async function getPaymentReportData(startDate, endDate, rangeKey) {
  // Llamar directamente a la función del modelo que ya estructura los datos.
  // El servicio podría usarse para lógica de negocio adicional si fuera necesario,
  // como combinar datos de múltiples modelos o realizar cálculos más complejos
  // que no son puramente agregaciones SQL. En este caso, el modelo ya es bastante completo.
  const reportData = await facilityPaymentModel.getPaymentReportStats(startDate, endDate, rangeKey);

  // Aquí podríamos, por ejemplo, asegurar que todos los payment_methods o status esperados
  // estén presentes en byMethod y byStatus, incluso con valor 0 si no hay datos.
  // const expectedPaymentMethods = ['EFECTIVO', 'TARJETA_CREDITO', 'TRANSFERENCIA'];
  // const completeByMethod = { ...expectedPaymentMethods.reduce((acc, m) => ({...acc, [m]:0}), {}), ...reportData.byMethod};
  // reportData.byMethod = completeByMethod;
  // Similar para byStatus.

  return reportData;
}