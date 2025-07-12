const PatientReferenceModel = require('../models/relations/patientReferenceModel');
const PatientModel = require('../models/entities/patientModel');

async function createReference(patientId, data) {
  const patient = await PatientModel.findById(patientId);
  if (!patient) {
    const error = new Error('Paciente no encontrado.');
    error.statusCode = 404;
    throw error;
  }
  return PatientReferenceModel.addReference(patientId, data);
}

async function getReferencesByPatientId(patientId) {
  const patient = await PatientModel.findById(patientId);
  if (!patient) {
    const error = new Error('Paciente no encontrado.');
    error.statusCode = 404;
    throw error;
  }
  return PatientReferenceModel.getReferencesByPatientId(patientId);
}

async function getReferenceById(referenceId) {
  const reference = await PatientReferenceModel.findById(referenceId);
  if (!reference) {
    const error = new Error('Persona de referencia no encontrada.');
    error.statusCode = 404;
    throw error;
  }
  return reference;
}

async function updateReference(referenceId, data) {
  const reference = await PatientReferenceModel.findById(referenceId);
  if (!reference) {
    const error = new Error('Persona de referencia no encontrada.');
    error.statusCode = 404;
    throw error;
  }

  await PatientReferenceModel.update(referenceId, data);
  return PatientReferenceModel.findById(referenceId);
}

async function deleteReference(referenceId) {
  const reference = await PatientReferenceModel.findById(referenceId);
  if (!reference) {
    const error = new Error('Persona de referencia no encontrada.');
    error.statusCode = 404;
    throw error;
  }
  await PatientReferenceModel.delete(referenceId);
  return { message: 'Persona de referencia eliminada exitosamente.' };
}

module.exports = {
  createReference,
  getReferencesByPatientId,
  getReferenceById,
  updateReference,
  deleteReference
};