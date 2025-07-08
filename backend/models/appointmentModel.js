const pool = require('../config/db');
const { buildAppointmentFilters } = require('../filters/sql/appointmentFilters');
const { buildPaginationAndOrder } = require('../filters/paginationUtils');

async function getAllAppointments() {
  const [rows] = await pool.query('SELECT * FROM appointments');
  return rows;
}

async function findAppointmentsWithFilters(query) {
  const { sql, params } = buildAppointmentFilters(query);
  let fullQuery = `SELECT * FROM appointments ${sql}`;
  // Paginación y ordenamiento
  const { sql: pagSql, params: pagParams } = buildPaginationAndOrder(
    query,
    ['appointment_id', 'patient_id', 'doctor_id', 'date', 'time', 'status', 'type']
  );
  fullQuery += pagSql;
  const [rows] = await pool.query(fullQuery, [...params, ...pagParams]);
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

async function getAppointmentReportStats(startDate, endDate, rangeKey) {
  const params = [startDate, endDate]; // For queries filtering by appointment date

  // 1. Total de citas en el período
  const [[{ totalAppointmentsInPeriod }]] = await pool.query(
    'SELECT COUNT(*) as totalAppointmentsInPeriod FROM appointments WHERE date >= ? AND date <= ?',
    params
  );

  // 2. Citas por status
  const [byStatusRows] = await pool.query(
    'SELECT status, COUNT(*) as count FROM appointments WHERE date >= ? AND date <= ? GROUP BY status',
    params
  );
  const byStatus = byStatusRows.reduce((acc, row) => {
    acc[row.status] = row.count;
    return acc;
  }, {});

  // 3. Citas por doctor
  const [byDoctorRows] = await pool.query(
    `SELECT a.doctor_id, CONCAT(d.first_name, ' ', d.last_name) as doctorName, COUNT(*) as count
     FROM appointments a
     JOIN doctors d ON a.doctor_id = d.doctor_id
     WHERE a.date >= ? AND a.date <= ?
     GROUP BY a.doctor_id, doctorName
     ORDER BY count DESC`,
    params
  );
  // Frontend espera: [{ doctorName: 'Dr. X', count: N }]
  const byDoctor = byDoctorRows.map(row => ({ doctorName: row.doctorName, count: row.count }));


  // 4. Citas por type
  const [byTypeRows] = await pool.query(
    'SELECT type, COUNT(*) as count FROM appointments WHERE date >= ? AND date <= ? GROUP BY type',
    params
  );
  const byType = byTypeRows.reduce((acc, row) => {
    acc[row.type] = row.count;
    return acc;
  }, {});

  // 5. Conteo de citas agrupadas por período (mes o día)
  const dateDiff = (new Date(endDate)).getTime() - (new Date(startDate)).getTime();
  const diffDays = Math.ceil(dateDiff / (1000 * 3600 * 24));
  const groupByFormat = diffDays > 60 ? '%Y-%m' : '%Y-%m-%d';

  const [byTimePeriodRows] = await pool.query(
    `SELECT DATE_FORMAT(date, ?) as period, COUNT(*) as count
     FROM appointments
     WHERE date >= ? AND date <= ?
     GROUP BY period
     ORDER BY period ASC`,
    [groupByFormat, startDate, endDate]
  );
   // Frontend espera: [{ date: 'YYYY-MM-DD', count: N }] (o YYYY-MM)
   // La query devuelve 'period', el frontend espera 'date' para el eje X en este caso.
   // Ajustamos el nombre de la propiedad aquí.
  const byTimePeriod = byTimePeriodRows.map(row => ({
    date: row.period, // 'YYYY-MM' o 'YYYY-MM-DD'
    count: row.count
  }));


  // Para tasas de cancelación/ausentismo, necesitamos el total de citas agendadas (no solo las del período de consulta)
  // o definirlo como % sobre las citas que *debían ocurrir* en el período.
  // Por simplicidad, calcularemos sobre las citas cuya fecha (date) cae en el período.
  const cancelledOrAbsentInPeriod = (byStatus['CANCELADA'] || 0) + (byStatus['AUSENTE'] || 0); // Asumiendo estos strings para status

  return {
    summary: {
      totalAppointmentsInPeriod: totalAppointmentsInPeriod || 0,
    },
    byStatus,
    byDoctor,
    byType,
    byTimePeriod,
    // Las tasas se calcularán en el servicio para mayor flexibilidad
    rawCounts: { // Pasamos conteos crudos al servicio
        cancelledCount: byStatus['CANCELADA'] || 0,
        absentCount: byStatus['AUSENTE'] || 0, // Asumiendo 'AUSENTE' como un estado posible
        completedCount: byStatus['COMPLETADA'] || 0, // Asumiendo 'COMPLETADA'
    }
  };
}

module.exports = { getAllAppointments, findAppointmentsWithFilters, createAppointment, updateAppointment, deleteAppointment, getAppointmentReportStats };