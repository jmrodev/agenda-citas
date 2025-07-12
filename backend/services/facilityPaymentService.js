const FacilityPaymentModel = require('../models/entities/facilityPaymentModel');

async function getDashboardStats() {
  const totalPayments = await FacilityPaymentModel.count();
  return { totalPagos: totalPayments };
}

async function getPaymentsStats() {
  return await FacilityPaymentModel.getPaymentsStats();
}

async function getPaymentsByDoctorStats() {
  return await FacilityPaymentModel.getPaymentsByDoctorStats();
}

async function getAllPayments() {
  return await FacilityPaymentModel.findAll();
}

async function getPaymentsByDateRange(dateFrom, dateTo) {
  return await FacilityPaymentModel.getPaymentsByDateRange(dateFrom, dateTo);
}

async function getPaymentsByDoctor(doctorId) {
  return await FacilityPaymentModel.getPaymentsByDoctor(doctorId);
}

async function getPaymentReportData(startDate, endDate, rangeKey) {
  const reportData = await FacilityPaymentModel.getPaymentReportStats(startDate, endDate, rangeKey);
  return reportData;
}

module.exports = { 
  getDashboardStats, 
  getPaymentsStats, 
  getPaymentsByDoctorStats,
  getAllPayments,
  getPaymentsByDateRange,
  getPaymentsByDoctor,
  getPaymentReportData
};
