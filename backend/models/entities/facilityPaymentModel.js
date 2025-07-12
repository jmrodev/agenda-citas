const BaseModel = require('../base/BaseModel');
const pool = require('../../config/db');

class FacilityPaymentModel extends BaseModel {
  constructor() {
    super('facility_payments', 'payment_id');
  }

  async getPaymentsByDateRange(dateFrom, dateTo) {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.tableName} WHERE payment_date BETWEEN ? AND ?`,
      [dateFrom, dateTo]
    );
    return rows;
  }

  async getPaymentsByDoctor(doctorId) {
    return this.findAllByField('doctor_id', doctorId);
  }

  async getTotalAmount() {
    const [rows] = await pool.query(`SELECT SUM(total_amount) as total FROM ${this.tableName}`);
    return rows[0].total || 0;
  }

  async getPaymentsStats() {
    const [rows] = await pool.query(`
      SELECT
        COUNT(*) as total_payments,
        SUM(total_amount) as total_amount,
        AVG(total_amount) as average_amount,
        MIN(payment_date) as first_payment,
        MAX(payment_date) as last_payment
      FROM ${this.tableName}
    `);
    return rows[0];
  }

  async getPaymentsByDoctorStats() {
    const [rows] = await pool.query(`
      SELECT
        d.doctor_id,
        d.first_name,
        d.last_name,
        COUNT(fp.payment_id) as total_payments,
        SUM(fp.total_amount) as total_amount,
        AVG(fp.total_amount) as average_amount
      FROM doctors d
      LEFT JOIN ${this.tableName} fp ON d.doctor_id = fp.doctor_id
      GROUP BY d.doctor_id, d.first_name, d.last_name
      ORDER BY total_amount DESC
    `);
    return rows;
  }

  async paymentBelongsToDoctor(doctor_id, payment_id) {
    const [rows] = await pool.query(
      `SELECT 1 FROM ${this.tableName} WHERE doctor_id = ? AND payment_id = ?`,
      [doctor_id, payment_id]
    );
    return rows.length > 0;
  }

  async getPaymentReportStats(startDate, endDate) {
    const params = [startDate, endDate];

    const [[{ totalRevenueInPeriod }]] = await pool.query(
      `SELECT SUM(total_amount) as totalRevenue FROM ${this.tableName} WHERE payment_date >= ? AND payment_date <= ? AND status = 'COMPLETADO'`,
      params
    );

    const [[{ averagePaymentAmount }]] = await pool.query(
      `SELECT AVG(total_amount) as averagePayment FROM ${this.tableName} WHERE payment_date >= ? AND payment_date <= ? AND status = 'COMPLETADO'`,
      params
    );

    const [[{ pendingAmount }]] = await pool.query(
      `SELECT SUM(total_amount) as pendingAmount FROM ${this.tableName} WHERE payment_date >= ? AND payment_date <= ? AND status = 'PENDIENTE'`,
      params
    );

    const [byMethodRows] = await pool.query(
      `SELECT payment_method, SUM(total_amount) as total_amount_sum FROM ${this.tableName} WHERE payment_date >= ? AND payment_date <= ? AND status = 'COMPLETADO' GROUP BY payment_method`,
      params
    );
    const byMethod = byMethodRows.reduce((acc, row) => {
      if (row.payment_method) {
        acc[row.payment_method] = parseFloat(row.total_amount_sum) || 0;
      }
      return acc;
    }, {});

    const [byStatusRows] = await pool.query(
      `SELECT status, COUNT(*) as count FROM ${this.tableName} WHERE payment_date >= ? AND payment_date <= ? GROUP BY status`,
      params
    );
    const byStatus = byStatusRows.reduce((acc, row) => {
      if (row.status) {
          acc[row.status] = row.count;
      }
      return acc;
    }, {});

    const dateDiff = (new Date(endDate)).getTime() - (new Date(startDate)).getTime();
    const diffDays = Math.ceil(dateDiff / (1000 * 3600 * 24));
    const groupByFormat = diffDays > 60 ? '%Y-%m' : '%Y-%m-%d';

    const [revenueOverTimeRows] = await pool.query(
      `SELECT DATE_FORMAT(payment_date, ?) as period, SUM(total_amount) as total_amount
       FROM ${this.tableName}
       WHERE payment_date >= ? AND payment_date <= ? AND status = 'COMPLETADO'
       GROUP BY period
       ORDER BY period ASC`,
      [groupByFormat, startDate, endDate]
    );
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
      byMethod,
      byStatus,
      revenueOverTime,
    };
  }
}

module.exports = new FacilityPaymentModel();
