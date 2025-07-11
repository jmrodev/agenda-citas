const doctorService = require('../services/doctorService');
const { parseAndValidateDate } = require('../utils/date');

async function getAll(req, res) {
  try {
    // Podríamos añadir filtros aquí si es necesario en el futuro, similar a patientController
    const doctors = await doctorService.listDoctors();
    res.json(doctors);
  } catch (err) {
    // Considerar un logger para errores del servidor
    res.status(500).json({ error: 'Error al obtener la lista de doctores.' });
  }
}

async function create(req, res) {
  try {
    // req.body ya validado por Joi (createDoctorSchema)
    // El esquema Joi maneja la validación de formato de last_earnings_collection_date.
    // Se asume que el servicio puede manejar el formato validado por Joi (string ISO o el objeto fecha).
    const doctorData = req.body;

    const doctor = await doctorService.createDoctor(doctorData);
    res.status(201).json(doctor);
  } catch (err) {
    if (err.message.includes('Duplicate entry')) { // Ejemplo de manejo de error específico
        return res.status(409).json({ error: 'Error al crear el doctor: Ya existe un doctor con ese email o número de licencia.' });
    }
    res.status(500).json({ error: `Error al crear el doctor: ${err.message}` });
  }
}

async function update(req, res) {
  const doctorId = req.params.id;
  try {
    // req.body ya validado por Joi (updateDoctorSchema)
    const doctorData = req.body;

    const doctor = await doctorService.updateDoctor(doctorId, doctorData);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor no encontrado para actualizar.' });
    }
    res.json(doctor);
  } catch (err) {
    if (err.message.includes('Duplicate entry')) {
        return res.status(409).json({ error: 'Error al actualizar el doctor: Ya existe otro doctor con ese email o número de licencia.' });
    }
    if (err.message === 'Doctor not found') { // Si el servicio lanza este error específico
        return res.status(404).json({ error: 'Doctor no encontrado.' });
    }
    res.status(500).json({ error: `Error al actualizar el doctor: ${err.message}` });
  }
}

async function remove(req, res) {
  const doctorId = req.params.id;
  try {
    const result = await doctorService.deleteDoctor(doctorId);
    if (!result) { // El servicio podría devolver false/null si no se eliminó nada
        return res.status(404).json({ error: 'Doctor no encontrado para eliminar.' });
    }
    res.json({ message: 'Doctor eliminado correctamente.' });
  } catch (err) {
    // Si hay una restricción de clave foránea (ej. el doctor tiene citas)
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({ error: 'No se puede eliminar el doctor porque tiene datos asociados (citas, pacientes, etc.). Considere desactivarlo o reasignar sus responsabilidades.' });
    }
    res.status(500).json({ error: `Error al eliminar el doctor: ${err.message}` });
  }
}

async function getDashboardStats(req, res) {
  try {
    const stats = await doctorService.getDashboardStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener estadísticas de doctores.' });
  }
}

// Modificado para incluir pacientes
async function getById(req, res) {
  const doctorId = req.params.id;
  console.log('getById called with doctorId:', doctorId);
  try {
    // Usamos getDoctorWithPatients para incluir la lista de pacientes.
    // El servicio se encargará de llamar al método correcto del modelo.
    const doctor = await doctorService.getDoctorWithPatientsDetails(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor no encontrado.' });
    }
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: `Error al obtener el doctor: ${err.message}` });
  }
}

// Nueva función para obtener solo los pacientes de un doctor específico
async function getPatientsForDoctor(req, res) {
  const doctorId = req.params.id;
  try {
    const patients = await doctorService.getPatientsByDoctorId(doctorId);
    // No es un error 404 si el doctor existe pero no tiene pacientes.
    // El servicio debería verificar si el doctor existe primero.
    // Si el doctorService.getPatientsByDoctorId devuelve null o lanza error si el doctor no existe:
    if (patients === null) { // Asumiendo que el servicio devuelve null si el doctor no existe
        return res.status(404).json({ error: 'Doctor no encontrado.' });
    }
    res.json(patients);
  } catch (err) {
     if (err.message === 'Doctor not found') {
        return res.status(404).json({ error: 'Doctor no encontrado.' });
    }
    res.status(500).json({ error: `Error al obtener los pacientes del doctor: ${err.message}` });
  }
}


module.exports = {
  getAll,
  create,
  update,
  remove,
  getDashboardStats,
  getById,
  getPatientsForDoctor // Exportar la nueva función
};