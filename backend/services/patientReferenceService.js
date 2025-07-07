const patientReferenceModel = require('../models/patientReferenceModel');
const patientModel = require('../models/patientModel'); // Para verificar existencia del paciente

async function createReference(patientId, data) {
  const patient = await patientModel.getPatientById(patientId);
  if (!patient) {
    const error = new Error('Paciente no encontrado.');
    error.statusCode = 404;
    throw error;
  }
  // El modelo addReference ya maneja la lógica de DNI duplicado para el mismo paciente.
  return patientReferenceModel.addReference(patientId, data);
}

async function getReferencesByPatientId(patientId) {
  const patient = await patientModel.getPatientById(patientId);
  if (!patient) {
    // Podríamos optar por devolver un array vacío si el paciente no existe,
    // o lanzar un error. Lanzar error es más explícito.
    const error = new Error('Paciente no encontrado.');
    error.statusCode = 404;
    throw error;
  }
  return patientReferenceModel.getReferencesByPatientId(patientId);
}

async function getReferenceById(referenceId) {
  const reference = await patientReferenceModel.getReferenceById(referenceId);
  if (!reference) {
    const error = new Error('Persona de referencia no encontrada.');
    error.statusCode = 404;
    throw error;
  }
  return reference;
}

async function updateReference(referenceId, data) {
  const reference = await patientReferenceModel.getReferenceById(referenceId);
  if (!reference) {
    const error = new Error('Persona de referencia no encontrada.');
    error.statusCode = 404;
    throw error;
  }

  // Nota: La restricción UNIQUE(patient_id, dni) en la BBDD
  // se encargará de prevenir que este update cree un DNI duplicado
  // para el mismo patient_id si el DNI se está cambiando.
  // Una validación más explícita aquí podría hacerse si se quiere un mensaje de error más específico
  // antes de golpear la base de datos.

  await patientReferenceModel.updateReference(referenceId, data);
  return patientReferenceModel.getReferenceById(referenceId); // Devolver la referencia actualizada
}

async function deleteReference(referenceId) {
  const reference = await patientReferenceModel.getReferenceById(referenceId);
  if (!reference) {
    const error = new Error('Persona de referencia no encontrada.');
    error.statusCode = 404;
    throw error;
  }
  await patientReferenceModel.deleteReference(referenceId);
  return { message: 'Persona de referencia eliminada exitosamente.' };
}

module.exports = {
  createReference,
  getReferencesByPatientId,
  getReferenceById,
  updateReference,
  deleteReference
};