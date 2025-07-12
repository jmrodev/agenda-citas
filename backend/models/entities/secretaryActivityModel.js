const BaseModel = require('../base/BaseModel');
const pool = require('../../config/db');
const { buildPaginationAndOrder } = require('../../filters/paginationUtils');

class SecretaryActivityModel extends BaseModel {
  constructor() {
    super('secretary_activities', 'activity_id');
  }

  async getAllSecretaryActivities(filters = {}) {
    let query = `SELECT * FROM ${this.tableName} WHERE 1=1`;
    const params = [];
    if (filters.secretary_id) {
      query += ' AND secretary_id = ?';
      params.push(filters.secretary_id);
    }
    if (filters.date) {
      query += ' AND date = ?';
      params.push(filters.date);
    }
    if (filters.date_from) {
      query += ' AND date >= ?';
      params.push(filters.date_from);
    }
    if (filters.date_to) {
      query += ' AND date <= ?';
      params.push(filters.date_to);
    }
    if (filters.activity_type) {
      query += ' AND activity_type = ?';
      params.push(filters.activity_type);
    }
    if (filters.activity_types) {
      const types = Array.isArray(filters.activity_types)
        ? filters.activity_types
        : filters.activity_types.split(',');
      if (types.length > 0) {
        query += ` AND activity_type IN (${types.map(() => '?').join(',')})`;
        params.push(...types);
      }
    }
    if (filters.activity_id) {
      query += ' AND activity_id = ?';
      params.push(filters.activity_id);
    }
    if (filters.detail) {
      query += ' AND detail LIKE ?';
      params.push(`%${filters.detail}%`);
    }
    if (filters.time_from) {
      query += ' AND time >= ?';
      params.push(filters.time_from);
    }
    if (filters.time_to) {
      query += ' AND time <= ?';
      params.push(filters.time_to);
    }
    const { sql: pagSql, params: pagParams } = buildPaginationAndOrder(
      filters,
      ['activity_id', 'secretary_id', 'date', 'time', 'activity_type']
    );
    query += pagSql;
    params.push(...pagParams);
    const [rows] = await pool.query(query, params);
    return rows;
  }

  async getSecretaryActivityReportStats(startDate, endDate) {
    const params = [startDate, endDate];

    const [[{ totalActivitiesInPeriod }]] = await pool.query(
      `SELECT COUNT(*) as totalActivities FROM ${this.tableName} WHERE date >= ? AND date <= ?`,
      params
    );

    const [byTypeRows] = await pool.query(
      `SELECT activity_type, COUNT(*) as count FROM ${this.tableName} WHERE date >= ? AND date <= ? GROUP BY activity_type`,
      params
    );
    const activitiesByType = byTypeRows.reduce((acc, row) => {
      acc[row.activity_type] = row.count;
      return acc;
    }, {});

    const [bySecretaryRows] = await pool.query(
      `SELECT sa.secretary_id, CONCAT(s.first_name, ' ', s.last_name) as secretaryName, COUNT(*) as total_actions
       FROM ${this.tableName} sa
       JOIN secretaries s ON sa.secretary_id = s.secretary_id
       WHERE sa.date >= ? AND sa.date <= ?
       GROUP BY sa.secretary_id, secretaryName
       ORDER BY total_actions DESC`,
      params
    );
    const activitiesBySecretary = bySecretaryRows.map(row => ({
      secretaryId: row.secretary_id,
      secretaryName: row.secretaryName,
      total_actions: row.total_actions
    }));

    const dateDiff = (new Date(endDate)).getTime() - (new Date(startDate)).getTime();
    const diffDays = Math.ceil(dateDiff / (1000 * 3600 * 24));
    const groupByFormat = diffDays > 60 ? '%Y-%m' : '%Y-%m-%d';

    const [activityCountOverTimeRows] = await pool.query(
      `SELECT DATE_FORMAT(date, ?) as period, COUNT(*) as count
       FROM ${this.tableName}
       WHERE date >= ? AND date <= ?
       GROUP BY period
       ORDER BY period ASC`,
      [groupByFormat, startDate, endDate]
    );
    const activityCountOverTime = activityCountOverTimeRows.map(row => ({
      date: row.period,
      count: row.count
    }));

    return {
      summary: {
        totalActivitiesInPeriod: totalActivitiesInPeriod || 0,
      },
      activitiesByType,
      activitiesBySecretary,
      activityCountOverTime,
    };
  }
}

module.exports = new SecretaryActivityModel();
