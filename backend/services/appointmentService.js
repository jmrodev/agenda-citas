const appointmentModel = require('../models/appointmentModel');

async function listAppointments() {
  return await appointmentModel.getAllAppointments();
}

async function listAppointmentsWithFilters(query) {
  return await appointmentModel.findAppointmentsWithFilters(query);
}

async function createAppointment(data) {
  return await appointmentModel.createAppointment(data);
}

async function updateAppointment(id, data) {
  return await appointmentModel.updateAppointment(id, data);
}

async function deleteAppointment(id) {
  return await appointmentModel.deleteAppointment(id);
}

module.exports = { listAppointments, listAppointmentsWithFilters, createAppointment, updateAppointment, deleteAppointment }; 