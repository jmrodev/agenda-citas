const appointmentModel = require('../models/appointmentModel');
const doctorConsultationHourModel = require('../models/doctorConsultationHourModel');

function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

async function listAppointments() {
  return await appointmentModel.getAllAppointments();
}

async function listAppointmentsWithFilters(query) {
  return await appointmentModel.findAppointmentsWithFilters(query);
}

async function createAppointment(data) {
  const { patient_id, doctor_id, date, time } = data;

  // 1. Verificar que el paciente no tenga otra cita activa con el mismo médico
  const sameDoctor = await appointmentModel.findAppointmentsWithFilters({
    paciente_id: patient_id,
    doctor_id: doctor_id,
    estado: ['pendiente', 'confirmada']
  });
  if (sameDoctor && sameDoctor.length > 0) {
    throw new Error('Ya tienes una cita activa con este médico.');
  }

  // 2. Verificar que el paciente no tenga otra cita en el mismo horario
  const overlap = await appointmentModel.findAppointmentsWithFilters({
    paciente_id: patient_id,
    fecha: date,
    estado: ['pendiente', 'confirmada'],
  });
  if (overlap && overlap.some(cita => cita.time === time)) {
    throw new Error('Ya tienes una cita en ese horario.');
  }

  // 3. Verificar disponibilidad del médico
  // Obtener el día de la semana (en español, para compatibilidad con la tabla)
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const dayOfWeek = dias[new Date(date).getDay()];
  const hours = await doctorConsultationHourModel.getConsultationHoursByDoctorAndDay(doctor_id, dayOfWeek);
  const requestedMinutes = timeToMinutes(time);
  const disponible = hours.some(h =>
    requestedMinutes >= timeToMinutes(h.start_time) && requestedMinutes < timeToMinutes(h.end_time)
  );
  if (!disponible) {
    throw new Error('El médico no está disponible en ese horario.');
  }

  return await appointmentModel.createAppointment(data);
}

async function updateAppointment(id, data) {
  return await appointmentModel.updateAppointment(id, data);
}

async function deleteAppointment(id) {
  return await appointmentModel.deleteAppointment(id);
}

async function getDashboardStats() {
  const today = new Date().toISOString().slice(0, 10);
  const rows = await appointmentModel.getAllAppointments();
  const citasHoy = rows.filter(cita => cita.date && cita.date.toISOString().slice(0, 10) === today);
  return { citasHoy: citasHoy.length };
}

async function getAppointmentReportData(startDate, endDate, rangeKey) {
  const reportStats = await appointmentModel.getAppointmentReportStats(startDate, endDate, rangeKey);

  let cancellationRate = 0;
  let noShowRate = 0;
  const totalAppointments = reportStats.summary.totalAppointmentsInPeriod;

  if (totalAppointments > 0) {
    cancellationRate = (reportStats.rawCounts.cancelledCount / totalAppointments) * 100;
    // Definir noShowRate sobre el total de citas que no fueron canceladas previamente.
    // O sobre el total de citas del período. Usaremos la segunda para simplicidad y consistencia con lo que espera el frontend.
    noShowRate = (reportStats.rawCounts.absentCount / totalAppointments) * 100;
  }

  // Asegurarse de que todos los estados posibles estén presentes en byStatus, incluso con 0.
  // Esto depende de los estados reales que maneja la aplicación.
  // Ejemplo: const allStatuses = ['PENDIENTE', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA', 'AUSENTE'];
  // const completeByStatus = { ...allStatuses.reduce((acc, s) => ({...acc, [s]:0}), {}), ...reportStats.byStatus};


  return {
    summary: reportStats.summary,
    rates: {
      cancellationRate: parseFloat(cancellationRate.toFixed(1)),
      noShowRate: parseFloat(noShowRate.toFixed(1)),
      // Podríamos añadir completionRate también
      // completionRate: totalAppointments > 0 ? (reportStats.rawCounts.completedCount / totalAppointments) * 100 : 0
    },
    byStatus: reportStats.byStatus, // O completeByStatus si se implementa
    byDoctor: reportStats.byDoctor,
    byType: reportStats.byType,
    byTimePeriod: reportStats.byTimePeriod,
    // debug: reportStats.debug // Si el modelo lo tuviera
  };
}

module.exports = { listAppointments, listAppointmentsWithFilters, createAppointment, updateAppointment, deleteAppointment, getDashboardStats, getAppointmentReportData };