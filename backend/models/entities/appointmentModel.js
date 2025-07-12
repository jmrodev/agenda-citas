const pool = require('../../config/db');
const BaseModel = require('../base/BaseModel');
const { buildAppointmentFilters } = require('../../filters/sql');
const { buildPaginationAndOrder } = require('../../filters/paginationUtils');

class AppointmentModel extends BaseModel {
  constructor() {
    super('appointments', 'appointment_id');
  }

  async findAppointmentsWithFilters(query) {
    const { sql, params } = buildAppointmentFilters(query);
    let fullQuery = `SELECT * FROM ${this.tableName} ${sql}`;
    // Paginación y ordenamiento
    const { sql: pagSql, params: pagParams } = buildPaginationAndOrder(
      query,
      ['appointment_id', 'patient_id', 'doctor_id', 'date', 'time', 'status', 'type']
    );
    fullQuery += pagSql;
    const [rows] = await pool.query(fullQuery, [...params, ...pagParams]);
    return rows;
  }

  async updateAppointmentStatus(id, status) {
    await pool.query(`UPDATE ${this.tableName} SET status=? WHERE ${this.primaryKey}=?`, [status, id]);
    return { [this.primaryKey]: id, status };
  }

  async getAppointmentsByDoctor(doctorId) {
    const [rows] = await pool.query(`
      SELECT a.*,
             CONCAT(p.first_name, ' ', p.last_name) as patient_name,
             CONCAT(d.first_name, ' ', d.last_name) as doctor_name
      FROM ${this.tableName} a
      JOIN patients p ON a.patient_id = p.patient_id
      JOIN doctors d ON a.doctor_id = d.doctor_id
      WHERE a.doctor_id = ?
      ORDER BY a.date ASC, a.time ASC
    `, [doctorId]);
    return rows;
  }

  async getAppointmentReportStats(startDate, endDate) {
    const params = [startDate, endDate];

    const [[{ totalAppointmentsInPeriod }]] = await pool.query(
      `SELECT COUNT(*) as totalAppointmentsInPeriod FROM ${this.tableName} WHERE date >= ? AND date <= ?`,
      params
    );

    const [byStatusRows] = await pool.query(
      `SELECT status, COUNT(*) as count FROM ${this.tableName} WHERE date >= ? AND date <= ? GROUP BY status`,
      params
    );
    const byStatus = byStatusRows.reduce((acc, row) => {
      acc[row.status] = row.count;
      return acc;
    }, {});

    const [byDoctorRows] = await pool.query(
      `SELECT a.doctor_id, CONCAT(d.first_name, ' ', d.last_name) as doctorName, COUNT(*) as count
       FROM ${this.tableName} a
       JOIN doctors d ON a.doctor_id = d.doctor_id
       WHERE a.date >= ? AND a.date <= ?
       GROUP BY a.doctor_id, doctorName
       ORDER BY count DESC`,
      params
    );
    const byDoctor = byDoctorRows.map(row => ({ doctorName: row.doctorName, count: row.count }));

    const [byTypeRows] = await pool.query(
      `SELECT type, COUNT(*) as count FROM ${this.tableName} WHERE date >= ? AND date <= ? GROUP BY type`,
      params
    );
    const byType = byTypeRows.reduce((acc, row) => {
      acc[row.type] = row.count;
      return acc;
    }, {});

    const dateDiff = (new Date(endDate)).getTime() - (new Date(startDate)).getTime();
    const diffDays = Math.ceil(dateDiff / (1000 * 3600 * 24));
    const groupByFormat = diffDays > 60 ? '%Y-%m' : '%Y-%m-%d';

    const [byTimePeriodRows] = await pool.query(
      `SELECT DATE_FORMAT(date, ?) as period, COUNT(*) as count
       FROM ${this.tableName}
       WHERE date >= ? AND date <= ?
       GROUP BY period
       ORDER BY period ASC`,
      [groupByFormat, startDate, endDate]
    );
    const byTimePeriod = byTimePeriodRows.map(row => ({
      date: row.period,
      count: row.count
    }));

    return {
      summary: {
        totalAppointmentsInPeriod: totalAppointmentsInPeriod || 0,
      },
      byStatus,
      byDoctor,
      byType,
      byTimePeriod,
      rawCounts: {
          cancelledCount: byStatus['CANCELADA'] || 0,
          absentCount: byStatus['AUSENTE'] || 0,
          completedCount: byStatus['COMPLETADA'] || 0,
      }
    };
  }
}

module.exports = new AppointmentModel();
