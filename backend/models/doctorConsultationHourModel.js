const pool = require('../config/db');

async function getAllConsultationHours() {
  const [rows] = await pool.query('SELECT * FROM doctor_consultation_hours');
  return rows;
}

async function createConsultationHour(data) {
  const { doctor_id, day_of_week, start_time, end_time } = data;
  const [result] = await pool.query(
    'INSERT INTO doctor_consultation_hours (doctor_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)',
    [doctor_id, day_of_week, start_time, end_time]
  );
  return { consultation_hour_id: result.insertId, ...data };
}

async function updateConsultationHour(id, data) {
  const { doctor_id, day_of_week, start_time, end_time } = data;
  await pool.query(
    'UPDATE doctor_consultation_hours SET doctor_id=?, day_of_week=?, start_time=?, end_time=? WHERE consultation_hour_id=?',
    [doctor_id, day_of_week, start_time, end_time, id]
  );
  return { consultation_hour_id: id, ...data };
}

async function deleteConsultationHour(id) {
  await pool.query('DELETE FROM doctor_consultation_hours WHERE consultation_hour_id=?', [id]);
  return { consultation_hour_id: id };
}

async function getConsultationHoursByDoctorAndDay(doctor_id, day_of_week) {
  const [rows] = await pool.query(
    'SELECT * FROM doctor_consultation_hours WHERE doctor_id = ? AND day_of_week = ?',
    [doctor_id, day_of_week]
  );
  return rows;
}

module.exports = { getAllConsultationHours, createConsultationHour, updateConsultationHour, deleteConsultationHour, getConsultationHoursByDoctorAndDay }; 