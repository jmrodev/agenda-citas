const AppointmentModel = require('../models/entities/appointmentModel');
const DoctorConsultationHourModel = require('../models/relations/doctorConsultationHourModel');

function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

async function listAppointments() {
  return await AppointmentModel.findAll();
}

async function listAppointmentsWithFilters(query) {
  return await AppointmentModel.findAppointmentsWithFilters(query);
}

async function createAppointment(data) {
  const { patient_id, doctor_id, date, time, isOutOfSchedule = false } = data;

  const sameDoctor = await AppointmentModel.findWithFilters({
    patient_id: patient_id,
    doctor_id: doctor_id,
    status: ['pendiente', 'confirmada', 'pendiente_confirmacion']
  });
  if (sameDoctor && sameDoctor.length > 0) {
    throw new Error('Ya tienes una cita activa con este médico.');
  }

  const overlap = await AppointmentModel.findWithFilters({
    patient_id: patient_id,
    date: date,
    status: ['pendiente', 'confirmada', 'pendiente_confirmacion'],
  });
  if (overlap && overlap.some(cita => cita.time === time)) {
    throw new Error('Ya tienes una cita en ese horario.');
  }

  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const dayOfWeek = dias[new Date(date).getDay()];
  const hours = await DoctorConsultationHourModel.getConsultationHoursByDoctorAndDay(doctor_id, dayOfWeek);
  const requestedMinutes = timeToMinutes(time);
  const disponible = hours.some(h =>
    requestedMinutes >= timeToMinutes(h.start_time) && requestedMinutes < timeToMinutes(h.end_time)
  );

  let status = 'pendiente';
  if (!disponible && isOutOfSchedule) {
    status = 'pendiente_confirmacion';
  } else if (!disponible && !isOutOfSchedule) {
    throw new Error('El médico no está disponible en ese horario.');
  }

  const appointmentData = { ...data, status };
  return await AppointmentModel.create(appointmentData);
}

async function updateAppointment(id, data) {
  return await AppointmentModel.update(id, data);
}

async function deleteAppointment(id) {
  return await AppointmentModel.delete(id);
}

async function updateAppointmentStatus(id, status) {
  return await AppointmentModel.updateAppointmentStatus(id, status);
}

async function getAppointmentsByDoctor(doctorId) {
  return await AppointmentModel.getAppointmentsByDoctor(doctorId);
}

async function confirmOutOfScheduleAppointment(id) {
  return await AppointmentModel.updateAppointmentStatus(id, 'confirmada');
}

async function rejectOutOfScheduleAppointment(id) {
  return await AppointmentModel.updateAppointmentStatus(id, 'cancelada');
}

async function getDashboardStats() {
  const today = new Date().toISOString().slice(0, 10);
  const rows = await AppointmentModel.findAll();
  const citasHoy = rows.filter(cita => cita.date && cita.date.toISOString().slice(0, 10) === today);
  return { citasHoy: citasHoy.length };
}

async function getAppointmentReportData(startDate, endDate, rangeKey) {
  const reportStats = await AppointmentModel.getAppointmentReportStats(startDate, endDate, rangeKey);

  let cancellationRate = 0;
  let noShowRate = 0;
  const totalAppointments = reportStats.summary.totalAppointmentsInPeriod;

  if (totalAppointments > 0) {
    cancellationRate = (reportStats.rawCounts.cancelledCount / totalAppointments) * 100;
    noShowRate = (reportStats.rawCounts.absentCount / totalAppointments) * 100;
  }

  return {
    summary: reportStats.summary,
    rates: {
      cancellationRate: parseFloat(cancellationRate.toFixed(1)),
      noShowRate: parseFloat(noShowRate.toFixed(1)),
    },
    byStatus: reportStats.byStatus,
    byDoctor: reportStats.byDoctor,
    byType: reportStats.byType,
    byTimePeriod: reportStats.byTimePeriod,
  };
}

module.exports = { 
  listAppointments, 
  listAppointmentsWithFilters, 
  createAppointment, 
  updateAppointment, 
  deleteAppointment, 
  updateAppointmentStatus,
  getAppointmentsByDoctor,
  confirmOutOfScheduleAppointment,
  rejectOutOfScheduleAppointment,
  getDashboardStats, 
  getAppointmentReportData 
};
