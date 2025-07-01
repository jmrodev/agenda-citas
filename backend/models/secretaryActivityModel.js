const pool = require('../config/db');

async function getAllSecretaryActivities() {
  const [rows] = await pool.query('SELECT * FROM secretary_activities');
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

async function updateSecretaryActivity(id, data) {
  const { secretary_id, date, time, activity_type, detail } = data;
  await pool.query(
    'UPDATE secretary_activities SET secretary_id=?, date=?, time=?, activity_type=?, detail=? WHERE activity_id=?',
    [secretary_id, date, time, activity_type, detail, id]
  );
  return { activity_id: id, ...data };
}

async function deleteSecretaryActivity(id) {
  await pool.query('DELETE FROM secretary_activities WHERE activity_id=?', [id]);
  return { activity_id: id };
}

module.exports = { getAllSecretaryActivities, createSecretaryActivity, updateSecretaryActivity, deleteSecretaryActivity }; 