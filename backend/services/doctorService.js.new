const DoctorModel = require('../models/doctorModel');

async function listDoctors() {
  return await DoctorModel.findAll();
}

async function createDoctor(data) {
  try {
    const newDoctor = await DoctorModel.create(data);
    return newDoctor;
  } catch (error) {
    throw error;
  }
}

async function updateDoctor(id, data) {
  const doctorExists = await DoctorModel.findById(id);
  if (!doctorExists) {
    throw new Error('Doctor not found');
  }
  try {
    await DoctorModel.update(id, data);
    return await DoctorModel.findById(id);
  } catch (error) {
    throw error;
  }
}

async function deleteDoctor(id) {
  const doctorExists = await DoctorModel.findById(id);
  if (!doctorExists) {
    return null;
  }
  try {
    await DoctorModel.delete(id);
    return true;
  } catch (error) {
    throw error;
  }
}

async function getDashboardStats() {
  const total = await DoctorModel.count();
  return { totalDoctores: total };
}

async function getDoctorById(id) {
  return await DoctorModel.findById(id);
}

async function getDoctorWithPatientsDetails(doctorId) {
  const doctor = await DoctorModel.getDoctorWithPatients(doctorId);
  if (!doctor) {
    return null;
  }
  return doctor;
}

async function getPatientsByDoctorId(doctorId) {
  const doctorExists = await DoctorModel.findById(doctorId);
  if (!doctorExists) {
    return null;
  }
  return await DoctorModel.getPatientsByDoctorId(doctorId);
}

module.exports = {
  listDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDashboardStats,
  getDoctorById,
  getDoctorWithPatientsDetails,
  getPatientsByDoctorId
};
