const pool = require('../config/db');

async function getAllSecretaryActivities(filters = {}) {
  let query = 'SELECT * FROM secretary_activities WHERE 1=1';
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
  const [rows] = await pool.query(query, params);
  return rows;
}

async function createSecretaryActivity(data) {
  const { secretary_id, date, time, activity_type, detail } = data;
  const [result] = await pool.query(
    'INSERT INTO secretary_activities (secretary_id, date, time, activity_type, detail) VALUES (?, ?, ?, ?, ?)',
    [secretary_id, date, time, activity_type, detail]
  );
  return { activity_id: result.insertId, ...data };
}

module.exports = { getAllSecretaryActivities, createSecretaryActivity }; 