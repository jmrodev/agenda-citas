const pool = require('../config/db');

async function getAllPayments() {
  const [rows] = await pool.query('SELECT * FROM facility_payments');
  return rows;
}

async function getPaymentsByDateRange(dateFrom, dateTo) {
  const [rows] = await pool.query(
    'SELECT * FROM facility_payments WHERE payment_date BETWEEN ? AND ?',
    [dateFrom, dateTo]
  );
  return rows;
}

async function getPaymentsByDoctor(doctorId) {
  const [rows] = await pool.query(
    'SELECT * FROM facility_payments WHERE doctor_id = ?',
    [doctorId]
  );
  return rows;
}

async function getTotalPayments() {
  const [rows] = await pool.query('SELECT COUNT(*) as total FROM facility_payments');
  return rows[0].total;
}

async function getTotalAmount() {
  const [rows] = await pool.query('SELECT SUM(total_amount) as total FROM facility_payments');
  return rows[0].total || 0;
}

async function getPaymentsStats() {
  const [rows] = await pool.query(`
    SELECT 
      COUNT(*) as total_payments,
      SUM(total_amount) as total_amount,
      AVG(total_amount) as average_amount,
      MIN(payment_date) as first_payment,
      MAX(payment_date) as last_payment
    FROM facility_payments
  `);
  return rows[0];
}

async function getPaymentsByDoctorStats() {
  const [rows] = await pool.query(`
    SELECT 
      d.doctor_id,
      d.first_name,
      d.last_name,
      COUNT(fp.payment_id) as total_payments,
      SUM(fp.total_amount) as total_amount,
      AVG(fp.total_amount) as average_amount
    FROM doctors d
    LEFT JOIN facility_payments fp ON d.doctor_id = fp.doctor_id
    GROUP BY d.doctor_id, d.first_name, d.last_name
    ORDER BY total_amount DESC
  `);
  return rows;
}

async function paymentBelongsToDoctor(doctor_id, payment_id) {
  const [rows] = await pool.query(
    'SELECT 1 FROM facility_payments WHERE doctor_id = ? AND payment_id = ?',
    [doctor_id, payment_id]
  );
  return rows.length > 0;
}

module.exports = { 
  getAllPayments, 
  getPaymentsByDateRange, 
  getPaymentsByDoctor, 
  getTotalPayments, 
  getTotalAmount, 
  getPaymentsStats,
  getPaymentsByDoctorStats,
  paymentBelongsToDoctor
}; 