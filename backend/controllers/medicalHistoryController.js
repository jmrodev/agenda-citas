const medicalHistoryService = require('../services/medicalHistoryService');
const medicalRecordPrescribedMedModel = require('../models/medicalRecordPrescribedMedModel');
const { parseAndValidateDate } = require('../utils/date');

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
    // req.body ya validado por Joi (createMedicalHistorySchema)
    const historyData = req.body;
    const record = await medicalHistoryService.createMedicalHistory(historyData);
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    // req.body ya validado por Joi (updateMedicalHistorySchema)
    const historyData = req.body;
    const record = await medicalHistoryService.updateMedicalHistory(req.params.id, historyData);
    if (!record) {
        return res.status(404).json({ error: 'Historial médico no encontrado para actualizar.' });
    }
    res.json(record);
  } catch (err) {
    if (err.message.toLowerCase().includes('not found')) {
        return res.status(404).json({ error: 'Historial médico no encontrado.' });
    }
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

async function getMedicalHistoryReportSummary(req, res) {
  try {
    const { startDate, endDate, rangeKey } = req.query; // rangeKey no se usa aquí pero lo mantenemos por consistencia
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Los parámetros startDate y endDate son requeridos.' });
    }

    const reportData = await medicalHistoryService.getMedicalHistoryReportData(startDate, endDate);
    res.json(reportData);
  } catch (err) {
    console.error('Error en getMedicalHistoryReportSummary:', err);
    res.status(500).json({ error: 'Error al obtener el resumen del reporte de historias clínicas: ' + err.message });
  }
}

module.exports = { getAll, getAllWithFilters, create, update, remove, getMyMedicalHistory, updatePrescribedMed, removePrescribedMed, getPrescribedMeds, createPrescribedMed, getMedicalHistoryReportSummary };