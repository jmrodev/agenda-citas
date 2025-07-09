const patientReferenceService = require('../services/patientReferenceService');
const { createReferencePersonSchema, updateReferencePersonSchema } = require('../validations'); // Modificado
const { debugReferences } = require('../utils/debug'); // Suponiendo que existe un debug para referencias

async function create(req, res) {
  try {
    debugReferences(`Creando referencia para paciente ID: ${req.params.patientId}, Body:`, req.body);
    const { error: validationError, value: validatedData } = createReferencePersonSchema.validate(req.body);
    if (validationError) {
      debugReferences('Error de validación al crear referencia:', validationError.details);
      return res.status(400).json({ error: validationError.details.map(d => d.message).join(', ') });
    }

    const patientId = req.params.patientId;
    const reference = await patientReferenceService.createReference(patientId, validatedData);
    debugReferences('Referencia creada:', reference);
    res.status(201).json(reference);
  } catch (err) {
    debugReferences('Error en controller create referencia:', err);
    if (err.code === 'DUPLICATE_DNI' || err.message.includes('Ya existe una persona de referencia con ese DNI')) {
        return res.status(409).json({ error: err.message });
    }
    if (err.message.includes('ER_DUP_ENTRY')) { // Error genérico de MySQL por entrada duplicada
        return res.status(409).json({ error: 'El DNI proporcionado ya está en uso por otra referencia para este paciente.' });
    }
    res.status(err.statusCode || 500).json({ error: err.message || 'Error al crear persona de referencia.' });
  }
}

async function listByPatient(req, res) {
  try {
    const patientId = req.params.patientId;
    debugReferences(`Listando referencias para paciente ID: ${patientId}`);
    const references = await patientReferenceService.getReferencesByPatientId(patientId);
    res.json(references);
  } catch (err) {
    debugReferences('Error en controller listByPatient referencia:', err);
    res.status(err.statusCode || 500).json({ error: err.message || 'Error al obtener personas de referencia.' });
  }
}

async function getById(req, res) {
  try {
    const referenceId = req.params.id;
    debugReferences(`Obteniendo referencia por ID: ${referenceId}`);
    const reference = await patientReferenceService.getReferenceById(referenceId);
    res.json(reference);
  } catch (err) {
    debugReferences('Error en controller getById referencia:', err);
    res.status(err.statusCode || 500).json({ error: err.message || 'Error al obtener persona de referencia.' });
  }
}

async function update(req, res) {
  try {
    const referenceId = req.params.id;
    debugReferences(`Actualizando referencia ID: ${referenceId}, Body:`, req.body);
    const { error: validationError, value: validatedData } = updateReferencePersonSchema.validate(req.body);
    if (validationError) {
      debugReferences('Error de validación al actualizar referencia:', validationError.details);
      return res.status(400).json({ error: validationError.details.map(d => d.message).join(', ') });
    }

    const updatedReference = await patientReferenceService.updateReference(referenceId, validatedData);
    debugReferences('Referencia actualizada:', updatedReference);
    res.json(updatedReference);
  } catch (err) {
    debugReferences('Error en controller update referencia:', err);
    if (err.message.includes('ER_DUP_ENTRY') || (err.code ==='ER_DUP_ENTRY')) {
        return res.status(409).json({ error: 'El DNI proporcionado ya está en uso por otra referencia para este paciente.' });
    }
    res.status(err.statusCode || 500).json({ error: err.message || 'Error al actualizar persona de referencia.' });
  }
}

async function remove(req, res) {
  try {
    const referenceId = req.params.id;
    debugReferences(`Eliminando referencia ID: ${referenceId}`);
    const result = await patientReferenceService.deleteReference(referenceId);
    res.json(result);
  } catch (err) {
    debugReferences('Error en controller remove referencia:', err);
    res.status(err.statusCode || 500).json({ error: err.message || 'Error al eliminar persona de referencia.' });
  }
}

module.exports = {
  create,
  listByPatient,
  getById,
  update,
  remove
};