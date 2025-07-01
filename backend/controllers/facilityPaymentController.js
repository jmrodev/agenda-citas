const facilityPaymentModel = require('../models/facilityPaymentModel');

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

module.exports.updatePayment = updatePayment;
module.exports.removePayment = removePayment; 