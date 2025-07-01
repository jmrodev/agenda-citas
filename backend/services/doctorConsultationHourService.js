const consultationHourModel = require('../models/doctorConsultationHourModel');

function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function isOverlap(startA, endA, startB, endB) {
  return timeToMinutes(startA) < timeToMinutes(endB) && timeToMinutes(startB) < timeToMinutes(endA);
}

async function listConsultationHours() {
  return await consultationHourModel.getAllConsultationHours();
}

async function createConsultationHour(data) {
  const { doctor_id, day_of_week, start_time, end_time } = data;
  const existing = await consultationHourModel.getConsultationHoursByDoctorAndDay(doctor_id, day_of_week);
  for (const hour of existing) {
    if (isOverlap(start_time, end_time, hour.start_time, hour.end_time)) {
      throw new Error('El horario se solapa con otro existente para este médico y día.');
    }
  }
  return await consultationHourModel.createConsultationHour(data);
}

async function updateConsultationHour(id, data) {
  const { doctor_id, day_of_week, start_time, end_time } = data;
  const existing = await consultationHourModel.getConsultationHoursByDoctorAndDay(doctor_id, day_of_week);
  for (const hour of existing) {
    if (hour.consultation_hour_id !== Number(id) && isOverlap(start_time, end_time, hour.start_time, hour.end_time)) {
      throw new Error('El horario se solapa con otro existente para este médico y día.');
    }
  }
  return await consultationHourModel.updateConsultationHour(id, data);
}

async function deleteConsultationHour(id) {
  return await consultationHourModel.deleteConsultationHour(id);
}

module.exports = { listConsultationHours, createConsultationHour, updateConsultationHour, deleteConsultationHour }; 