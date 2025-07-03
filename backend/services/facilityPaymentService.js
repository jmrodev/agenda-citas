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
  getPaymentsByDoctor
}; 