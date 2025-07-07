const doctorModel = require('../models/doctorModel');

async function listDoctors() {
  // Podría expandirse para aceptar filtros/paginación si es necesario
  return await doctorModel.getAllDoctors();
}

async function createDoctor(data) {
  // El modelo se encarga de la inserción. El servicio podría añadir lógica de negocio aquí si fuera necesario.
  // Por ejemplo, validar datos complejos o interactuar con otros servicios antes de crear.
  try {
    const newDoctor = await doctorModel.createDoctor(data);
    return newDoctor;
  } catch (error) {
    // Propagar el error para que el controlador lo maneje (ej. duplicate entry)
    throw error;
  }
}

async function updateDoctor(id, data) {
  const doctorExists = await doctorModel.getDoctorById(id);
  if (!doctorExists) {
    // Lanzar un error específico o devolver null para que el controlador sepa que no se encontró
    // Esto permite al controlador devolver un 404.
    throw new Error('Doctor not found');
  }
  try {
    const updatedDoctor = await doctorModel.updateDoctor(id, data);
    return updatedDoctor;
  } catch (error) {
    // Propagar el error (ej. duplicate entry en email/license si se cambia a uno existente)
    throw error;
  }
}

async function deleteDoctor(id) {
  const doctorExists = await doctorModel.getDoctorById(id);
  if (!doctorExists) {
    return null; // Indica que no se encontró el doctor para eliminar.
  }
  try {
    await doctorModel.deleteDoctor(id);
    return true; // Indica que la eliminación fue intentada (o exitosa si no hay error).
  } catch (error) {
    // Propagar el error (ej. ER_ROW_IS_REFERENCED_2)
    throw error;
  }
}

async function getDashboardStats() {
  // Usar la nueva función countDoctors del modelo para eficiencia.
  const total = await doctorModel.countDoctors();
  return { totalDoctores: total };
}

async function getDoctorById(id) {
  // Esta función se mantiene para obtener solo los datos básicos del doctor si es necesario en algún lugar.
  return await doctorModel.getDoctorById(id);
}

// Nueva función requerida por el controlador
async function getDoctorWithPatientsDetails(doctorId) {
  const doctor = await doctorModel.getDoctorWithPatients(doctorId);
  if (!doctor) {
    // El modelo getDoctorWithPatients ya debería devolver null si el doctor no existe.
    // No se necesita una verificación adicional aquí si el modelo lo maneja.
    return null;
  }
  return doctor;
}

// Nueva función requerida por el controlador
async function getPatientsByDoctorId(doctorId) {
  const doctorExists = await doctorModel.getDoctorById(doctorId);
  if (!doctorExists) {
    // Es importante verificar que el doctor exista antes de intentar obtener sus pacientes.
    // Esto asegura que devolvemos un indicativo claro (null o error) si el doctor no existe.
    // El controlador puede entonces devolver un 404.
    // Alternativamente, lanzar new Error('Doctor not found');
    return null;
  }
  // doctorModel.getPatientsByDoctorId devuelve un array de pacientes.
  // Si el doctor existe pero no tiene pacientes, devolverá un array vacío, lo cual es correcto.
  return await doctorModel.getPatientsByDoctorId(doctorId);
}

module.exports = {
  listDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDashboardStats,
  getDoctorById,
  getDoctorWithPatientsDetails, // Exportar nueva función
  getPatientsByDoctorId         // Exportar nueva función
};