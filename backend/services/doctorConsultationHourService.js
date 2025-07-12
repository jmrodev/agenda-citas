const DoctorConsultationHourModel = require('../models/relations/doctorConsultationHourModel');
const db = require('../config/db');

function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function isOverlap(startA, endA, startB, endB) {
  return timeToMinutes(startA) < timeToMinutes(endB) && timeToMinutes(startB) < timeToMinutes(endA);
}

async function listConsultationHours() {
  return await DoctorConsultationHourModel.findAll();
}

async function createConsultationHour(data) {
  const { doctor_id, day_of_week, start_time, end_time } = data;
  const existing = await DoctorConsultationHourModel.getConsultationHoursByDoctorAndDay(doctor_id, day_of_week);
  for (const hour of existing) {
    if (isOverlap(start_time, end_time, hour.start_time, hour.end_time)) {
      throw new Error('El horario se solapa con otro existente para este médico y día.');
    }
  }
  return await DoctorConsultationHourModel.create(data);
}

async function updateConsultationHour(id, data) {
  const { doctor_id, day_of_week, start_time, end_time } = data;
  const existing = await DoctorConsultationHourModel.getConsultationHoursByDoctorAndDay(doctor_id, day_of_week);
  for (const hour of existing) {
    if (hour.consultation_hour_id !== Number(id) && isOverlap(start_time, end_time, hour.start_time, hour.end_time)) {
      throw new Error('El horario se solapa con otro existente para este médico y día.');
    }
  }
  return await DoctorConsultationHourModel.update(id, data);
}

async function deleteConsultationHour(id) {
  return await DoctorConsultationHourModel.delete(id);
}

async function getDoctorScheduleByDay(doctorId, dayOfWeek) {
  try {
    const query = `
      SELECT consultation_hour_id, doctor_id, day_of_week, 
             TIME_FORMAT(start_time, '%H:%i') as start_time, 
             TIME_FORMAT(end_time, '%H:%i') as end_time
      FROM doctor_consultation_hours 
      WHERE doctor_id = ? AND day_of_week = ?
      ORDER BY start_time ASC
    `;
    
    const [rows] = await db.execute(query, [doctorId, dayOfWeek]);
    return rows;
  } catch (error) {
    console.error('Error getting doctor schedule by day:', error);
    throw error;
  }
}

async function getAllDoctorsScheduleByDay(dayOfWeek) {
  try {
    const query = `
      SELECT d.doctor_id, d.first_name, d.last_name,
             dch.consultation_hour_id, dch.day_of_week, 
             TIME_FORMAT(dch.start_time, '%H:%i') as start_time, 
             TIME_FORMAT(dch.end_time, '%H:%i') as end_time
      FROM doctors d
      INNER JOIN doctor_consultation_hours dch ON d.doctor_id = dch.doctor_id 
        AND dch.day_of_week = ?
      ORDER BY d.doctor_id, dch.start_time ASC
    `;
    
    const [rows] = await db.execute(query, [dayOfWeek]);
    
    const scheduleByDoctor = {};
    rows.forEach(row => {
      if (!scheduleByDoctor[row.doctor_id]) {
        scheduleByDoctor[row.doctor_id] = {
          doctor_id: row.doctor_id,
          doctor_name: `${row.first_name} ${row.last_name}`,
          schedule: []
        };
      }
      
      scheduleByDoctor[row.doctor_id].schedule.push({
        consultation_hour_id: row.consultation_hour_id,
        day_of_week: row.day_of_week,
        start_time: row.start_time,
        end_time: row.end_time
      });
    });
    
    return scheduleByDoctor;
  } catch (error) {
    console.error('Error getting all doctors schedule by day:', error);
    throw error;
  }
}

module.exports = { listConsultationHours, createConsultationHour, updateConsultationHour, deleteConsultationHour, getDoctorScheduleByDay, getAllDoctorsScheduleByDay };
