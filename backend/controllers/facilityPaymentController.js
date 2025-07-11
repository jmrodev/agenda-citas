const facilityPaymentModel = require('../models/facilityPaymentModel');
const facilityPaymentService = require('../services/facilityPaymentService');
const { parseAndValidateDate } = require('../utils/date');

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

async function create(req, res) {
  try {
    // req.body ya validado por Joi (createFacilityPaymentSchema)
    const paymentData = req.body;
    const payment = await facilityPaymentService.createPayment(paymentData);
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    // req.body ya validado por Joi (updateFacilityPaymentSchema)
    const paymentData = req.body;
    const payment = await facilityPaymentService.updatePayment(req.params.id, paymentData);
    if (!payment) {
        return res.status(404).json({ error: 'Pago no encontrado para actualizar.' });
    }
    res.json(payment);
  } catch (err) {
    if (err.message.toLowerCase().includes('not found')) {
        return res.status(404).json({ error: 'Pago no encontrado.' });
    }
    res.status(500).json({ error: err.message });
  }
}

module.exports = { 
  updatePayment, 
  removePayment, 
  getDashboardStats, 
  getPaymentsStats, 
  getPaymentsByDoctorStats,
  getAllPayments,
  getPaymentsByDateRange,
  create,
  update,
  getPaymentReportSummary // Nueva función
};

async function getPaymentReportSummary(req, res) {
  try {
    const { startDate, endDate, rangeKey } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Los parámetros startDate y endDate son requeridos.' });
    }

    const reportData = await facilityPaymentService.getPaymentReportData(startDate, endDate, rangeKey);
    res.json(reportData);
  } catch (err) {
    console.error('Error en getPaymentReportSummary:', err);
    res.status(500).json({ error: 'Error al obtener el resumen del reporte de pagos: ' + err.message });
  }
}