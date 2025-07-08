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
  paymentBelongsToDoctor,
  getPaymentReportStats // Nueva función
};

async function getPaymentReportStats(startDate, endDate, rangeKey) {
  const params = [startDate, endDate];

  // Asumiendo que los campos status y payment_method existen.
  // Si no, estas queries darán error o resultados vacíos para esas agrupaciones.
  // El status 'COMPLETADO' es una suposición, debe coincidir con el valor real en la BBDD.

  // 1. Suma de total_amount para pagos completados
  const [[{ totalRevenueInPeriod }]] = await pool.query(
    "SELECT SUM(total_amount) as totalRevenue FROM facility_payments WHERE payment_date >= ? AND payment_date <= ? AND status = 'COMPLETADO'",
    params
  );

  // 2. Promedio de total_amount para pagos completados
  const [[{ averagePaymentAmount }]] = await pool.query(
    "SELECT AVG(total_amount) as averagePayment FROM facility_payments WHERE payment_date >= ? AND payment_date <= ? AND status = 'COMPLETADO'",
    params
  );

  // 3. Suma de total_amount para pagos pendientes
  const [[{ pendingAmount }]] = await pool.query(
    "SELECT SUM(total_amount) as pendingAmount FROM facility_payments WHERE payment_date >= ? AND payment_date <= ? AND status = 'PENDIENTE'",
    params
  );

  // 4. Conteo/suma de pagos por payment_method (para completados)
  // Usaremos SUM(total_amount) para ver ingresos por método.
  const [byMethodRows] = await pool.query(
    "SELECT payment_method, SUM(total_amount) as total_amount_sum FROM facility_payments WHERE payment_date >= ? AND payment_date <= ? AND status = 'COMPLETADO' GROUP BY payment_method",
    params
  );
  const byMethod = byMethodRows.reduce((acc, row) => {
    if (row.payment_method) { // Solo incluir si payment_method no es null
      acc[row.payment_method] = parseFloat(row.total_amount_sum) || 0;
    }
    return acc;
  }, {});


  // 5. Conteo/suma de pagos por status
  // Usaremos COUNT(*) para ver cantidad de pagos por estado.
  const [byStatusRows] = await pool.query(
    'SELECT status, COUNT(*) as count FROM facility_payments WHERE payment_date >= ? AND payment_date <= ? GROUP BY status',
    params
  );
  const byStatus = byStatusRows.reduce((acc, row) => {
    if (row.status) { // Solo incluir si status no es null
        acc[row.status] = row.count;
    }
    return acc;
  }, {});

  // 6. Suma de total_amount (completados) agrupados por período
  const dateDiff = (new Date(endDate)).getTime() - (new Date(startDate)).getTime();
  const diffDays = Math.ceil(dateDiff / (1000 * 3600 * 24));
  const groupByFormat = diffDays > 60 ? '%Y-%m' : '%Y-%m-%d';

  const [revenueOverTimeRows] = await pool.query(
    `SELECT DATE_FORMAT(payment_date, ?) as period, SUM(total_amount) as total_amount
     FROM facility_payments
     WHERE payment_date >= ? AND payment_date <= ? AND status = 'COMPLETADO'
     GROUP BY period
     ORDER BY period ASC`,
    [groupByFormat, startDate, endDate]
  );
  // Frontend espera: [{ date: 'YYYY-MM-DD', total_amount: N }] (o YYYY-MM)
  const revenueOverTime = revenueOverTimeRows.map(row => ({
    date: row.period,
    total_amount: parseFloat(row.total_amount) || 0
  }));

  return {
    summary: {
      totalRevenueInPeriod: parseFloat(totalRevenueInPeriod) || 0,
      averagePaymentAmount: parseFloat(averagePaymentAmount) || 0,
      pendingAmount: parseFloat(pendingAmount) || 0,
    },
    byMethod, // Objeto { 'Efectivo': 1200, 'Tarjeta': 800 }
    byStatus, // Objeto { 'COMPLETADO': 10, 'PENDIENTE': 2 }
    revenueOverTime, // Array [{ date: '2023-01-01', total_amount: 100 }]
  };
}