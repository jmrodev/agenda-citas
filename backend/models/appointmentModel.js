const pool = require('../config/db');
const { buildAppointmentFilters } = require('../filters/appointmentFilters');

async function getAllAppointments() {
  const [rows] = await pool.query('SELECT * FROM appointments');
  return rows;
}

async function findAppointmentsWithFilters(query) {
  const { sql, params } = buildAppointmentFilters(query);
  const [rows] = await pool.query(`SELECT * FROM appointments ${sql}`, params);
  return rows;
}

async function createAppointment(data) {
  const { patient_id, doctor_id, date, time, reason, type, status, recorded_by_secretary_id, service_type, amount, payment_method, payment_date } = data;
  const [result] = await pool.query(
    'INSERT INTO appointments (patient_id, doctor_id, date, time, reason, type, status, recorded_by_secretary_id, service_type, amount, payment_method, payment_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [patient_id, doctor_id, date, time, reason, type, status, recorded_by_secretary_id, service_type, amount, payment_method, payment_date]
  );
  return { appointment_id: result.insertId, ...data };
}

async function updateAppointment(id, data) {
  const { patient_id, doctor_id, date, time, reason, type, status, recorded_by_secretary_id, service_type, amount, payment_method, payment_date } = data;
  await pool.query(
    'UPDATE appointments SET patient_id=?, doctor_id=?, date=?, time=?, reason=?, type=?, status=?, recorded_by_secretary_id=?, service_type=?, amount=?, payment_method=?, payment_date=? WHERE appointment_id=?',
    [patient_id, doctor_id, date, time, reason, type, status, recorded_by_secretary_id, service_type, amount, payment_method, payment_date, id]
  );
  return { appointment_id: id, ...data };
}

async function deleteAppointment(id) {
  await pool.query('DELETE FROM appointments WHERE appointment_id=?', [id]);
  return { appointment_id: id };
}

module.exports = { getAllAppointments, findAppointmentsWithFilters, createAppointment, updateAppointment, deleteAppointment }; 