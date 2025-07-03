const facilityPaymentModel = require('../models/facilityPaymentModel');
const facilityPaymentService = require('../services/facilityPaymentService');

async function updatePayment(req, res) {
  try {
    const { doctor_id, payment_id } = req.params;
    const belongs = await facilityPaymentModel.paymentBelongsToDoctor(doctor_id, payment_id);
    if (!belongs) {
      return res.status(404).json({ error: 'El pago no pertenece a este doctor' });
    }
    await facilityPaymentModel.updatePayment(payment_id, req.body);
    res.json({ message: 'Pago actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function removePayment(req, res) {
  try {
    const { doctor_id, payment_id } = req.params;
    const belongs = await facilityPaymentModel.paymentBelongsToDoctor(doctor_id, payment_id);
    if (!belongs) {
      return res.status(404).json({ error: 'El pago no pertenece a este doctor' });
    }
    await facilityPaymentModel.deletePayment(payment_id);
    res.json({ message: 'Pago eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDashboardStats(req, res) {
  try {
    const stats = await facilityPaymentService.getDashboardStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener estadísticas de pagos' });
  }
}

async function getPaymentsStats(req, res) {
  try {
    const stats = await facilityPaymentService.getPaymentsStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener estadísticas de pagos' });
  }
}

async function getPaymentsByDoctorStats(req, res) {
  try {
    const stats = await facilityPaymentService.getPaymentsByDoctorStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener estadísticas de pagos por doctor' });
  }
}

async function getAllPayments(req, res) {
  try {
    const payments = await facilityPaymentService.getAllPayments();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener pagos' });
  }
}

async function getPaymentsByDateRange(req, res) {
  try {
    const { dateFrom, dateTo } = req.query;
    const payments = await facilityPaymentService.getPaymentsByDateRange(dateFrom, dateTo);
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener pagos por rango de fechas' });
  }
}

module.exports = { 
  updatePayment, 
  removePayment, 
  getDashboardStats, 
  getPaymentsStats, 
  getPaymentsByDoctorStats,
  getAllPayments,
  getPaymentsByDateRange
}; 