const patientReferenceModel = require('../models/patientReferenceModel');

async function getAll(req, res) {
  try {
    const references = await patientReferenceModel.getReferencesByPatientId(req.params.patient_id);
    res.json(references);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    const reference = await patientReferenceModel.addReference(req.params.patient_id, req.body);
    res.status(201).json(reference);
  } catch (err) {
    if (err.code === 'DUPLICATE_DNI') {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const { patient_id, reference_id } = req.params;
    const belongs = await patientReferenceModel.referenceBelongsToPatient(patient_id, reference_id);
    if (!belongs) {
      return res.status(404).json({ error: 'Referencia no encontrada para este paciente' });
    }
    await patientReferenceModel.updateReference(reference_id, req.body);
    res.json({ message: 'Referencia actualizada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    const { patient_id, reference_id } = req.params;
    const belongs = await patientReferenceModel.referenceBelongsToPatient(patient_id, reference_id);
    if (!belongs) {
      return res.status(404).json({ error: 'Referencia no encontrada para este paciente' });
    }
    await patientReferenceModel.deleteReference(reference_id);
    res.json({ message: 'Referencia eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAll, create, update, remove }; 