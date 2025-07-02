const medicalHistoryService = require('../services/medicalHistoryService');
const medicalRecordPrescribedMedModel = require('../models/medicalRecordPrescribedMedModel');

async function getAll(req, res) {
  try {
    const histories = await medicalHistoryService.listMedicalHistories();
    res.json(histories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAllWithFilters(req, res) {
  try {
    const histories = await medicalHistoryService.listMedicalHistoriesWithFilters(req.query);
    res.json(histories);
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

async function getPrescribedMeds(req, res) {
  try {
    const { record_id } = req.params;
    const meds = await medicalRecordPrescribedMedModel.getPrescribedMedsByRecordId(record_id);
    res.json(meds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createPrescribedMed(req, res) {
  try {
    const { record_id } = req.params;
    const { medication_name, dose, instructions } = req.body;
    const med = await medicalRecordPrescribedMedModel.createPrescribedMed({ record_id, medication_name, dose, instructions });
    res.status(201).json(med);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAll, getAllWithFilters, create, update, remove, getMyMedicalHistory, updatePrescribedMed, removePrescribedMed, getPrescribedMeds, createPrescribedMed }; 