const prescriptionService = require('../services/prescriptionService');
const prescriptionMedicationModel = require('../models/prescriptionMedicationModel');
const { parseAndValidateDate } = require('../utils/date');

async function getAll(req, res) {
  try {
    const prescriptions = await prescriptionService.listPrescriptions();
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAllWithFilters(req, res) {
  try {
    const prescriptions = await prescriptionService.listPrescriptionsWithFilters(req.query);
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    // req.body ya validado por Joi (createPrescriptionSchema)
    const prescriptionData = req.body;
    const prescription = await prescriptionService.createPrescription(prescriptionData);
    res.status(201).json(prescription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    // req.body ya validado por Joi (updatePrescriptionSchema)
    const prescriptionData = req.body;
    const prescription = await prescriptionService.updatePrescription(req.params.id, prescriptionData);
    if (!prescription) {
        return res.status(404).json({ error: 'Prescripción no encontrada para actualizar.' });
    }
    res.json(prescription);
  } catch (err) {
    if (err.message.toLowerCase().includes('not found')) {
        return res.status(404).json({ error: 'Prescripción no encontrada.' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    const prescription = await prescriptionService.getPrescriptionById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }
    const createdDate = new Date(prescription.date);
    const now = new Date();
    const diffDays = (now - createdDate) / (1000 * 60 * 60 * 24);
    if (diffDays > 7) {
      return res.status(403).json({ error: 'No se puede eliminar la receta después de una semana' });
    }
    await prescriptionService.deletePrescription(req.params.id);
    res.json({ message: 'Receta eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getMyPrescriptions(req, res) {
  try {
    const patientId = req.user.entity_id;
    const prescriptions = await prescriptionService.getByPatientId(patientId);
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateMedication(req, res) {
  try {
    const { prescription_id, med_id } = req.params;
    const belongs = await prescriptionMedicationModel.medicationBelongsToPrescription(prescription_id, med_id);
    if (!belongs) {
      return res.status(404).json({ error: 'El medicamento no pertenece a la receta' });
    }
    await prescriptionMedicationModel.updateMedication(med_id, req.body);
    res.json({ message: 'Medicamento actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function removeMedication(req, res) {
  try {
    const { prescription_id, med_id } = req.params;
    const belongs = await prescriptionMedicationModel.medicationBelongsToPrescription(prescription_id, med_id);
    if (!belongs) {
      return res.status(404).json({ error: 'El medicamento no pertenece a la receta' });
    }
    await prescriptionMedicationModel.deleteMedication(med_id);
    res.json({ message: 'Medicamento eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAll, getAllWithFilters, create, update, remove, getMyPrescriptions, updateMedication, removeMedication }; 