async function paymentBelongsToDoctor(doctor_id, payment_id) {
  const [rows] = await pool.query(
    'SELECT 1 FROM facility_payments WHERE doctor_id = ? AND payment_id = ?',
    [doctor_id, payment_id]
  );
  return rows.length > 0;
}

module.exports.paymentBelongsToDoctor = paymentBelongsToDoctor; 