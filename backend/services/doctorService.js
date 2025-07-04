const doctorModel = require('../models/doctorModel');

async function listDoctors() {
  return await doctorModel.getAllDoctors();
}

async function createDoctor(data) {
  return await doctorModel.createDoctor(data);
}

async function updateDoctor(id, data) {
  return await doctorModel.updateDoctor(id, data);
}

async function deleteDoctor(id) {
  return await doctorModel.deleteDoctor(id);
}

async function getDashboardStats() {
  const rows = await doctorModel.getAllDoctors();
  return { totalDoctores: rows.length };
}

async function getDoctorById(id) {
  return await doctorModel.getDoctorById(id);
}

module.exports = { listDoctors, createDoctor, updateDoctor, deleteDoctor, getDashboardStats, getDoctorById }; 