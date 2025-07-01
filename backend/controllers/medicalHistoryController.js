const medicalHistoryService = require('../services/medicalHistoryService');
const medicalRecordPrescribedMedModel = require('../models/medicalRecordPrescribedMedModel');

async function getAll(req, res) {
  try {
    const history = await medicalHistoryService.listMedicalHistory();
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    const record = await medicalHistoryService.createMedicalHistory(req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const record = await medicalHistoryService.updateMedicalHistory(req.params.id, req.body);
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    await medicalHistoryService.deleteMedicalHistory(req.params.id);
    res.json({ message: 'Registro de historial médico eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getMyMedicalHistory(req, res) {
  try {
    const patientId = req.user.entity_id;
    const history = await medicalHistoryService.getByPatientId(patientId);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updatePrescribedMed(req, res) {
  try {
    const { record_id, med_id } = req.params;
    const belongs = await medicalRecordPrescribedMedModel.medBelongsToRecord(record_id, med_id);
    if (!belongs) {
      return res.status(404).json({ error: 'El medicamento no pertenece a este historial médico' });
    }
    await medicalRecordPrescribedMedModel.updatePrescribedMed(med_id, req.body);
    res.json({ message: 'Medicamento actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function removePrescribedMed(req, res) {
  try {
    const { record_id, med_id } = req.params;
    const belongs = await medicalRecordPrescribedMedModel.medBelongsToRecord(record_id, med_id);
    if (!belongs) {
      return res.status(404).json({ error: 'El medicamento no pertenece a este historial médico' });
    }
    await medicalRecordPrescribedMedModel.deletePrescribedMed(med_id);
    res.json({ message: 'Medicamento eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAll, create, update, remove, getMyMedicalHistory, updatePrescribedMed, removePrescribedMed }; 