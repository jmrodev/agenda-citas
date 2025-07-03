const appointmentService = require('../services/appointmentService');
const secretaryActivityService = require('../services/secretaryActivityService');
const consultationHourService = require('../services/doctorConsultationHourService');

async function getAllEvents(req, res) {
  try {
    // Citas
    const appointments = await appointmentService.listAppointments();
    const citas = appointments.map(a => ({
      id: `cita-${a.appointment_id}`,
      date: a.date,
      time: a.time,
      type: 'cita',
      title: a.reason || 'Cita médica',
      doctor_id: a.doctor_id,
      patient_id: a.patient_id,
      ...a
    }));

    // Actividades
    const activities = await secretaryActivityService.listSecretaryActivities({});
    const actividades = activities.map(act => ({
      id: `actividad-${act.activity_id}`,
      date: act.date,
      time: act.time,
      type: 'actividad',
      title: act.activity_type || 'Actividad',
      secretary_id: act.secretary_id,
      ...act
    }));

    // Disponibilidades
    const hours = await consultationHourService.listConsultationHours();
    const disponibilidades = hours.map(h => ({
      id: `disponibilidad-${h.consultation_hour_id}`,
      date: null, // No hay fecha específica, solo día de semana
      day_of_week: h.day_of_week,
      start_time: h.start_time,
      end_time: h.end_time,
      type: 'disponibilidad',
      title: `Disponibilidad: ${h.day_of_week} ${h.start_time}-${h.end_time}`,
      doctor_id: h.doctor_id,
      ...h
    }));

    // Unificar y devolver
    const allEvents = [...citas, ...actividades, ...disponibilidades];
    res.json(allEvents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAllEvents }; 