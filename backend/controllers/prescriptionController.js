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
    let data = { ...req.body };
    if (data.date && typeof data.date === 'object') {
      try {
        data.date = parseAndValidateDate(data.date, 'date', true);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    } else if (data.date) {
      return res.status(400).json({ error: 'date debe ser un objeto { day, month, year }' });
    }
    if (data.payment_date && typeof data.payment_date === 'object') {
      try {
        data.payment_date = parseAndValidateDate(data.payment_date, 'payment_date', true);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    } else if (data.payment_date) {
      return res.status(400).json({ error: 'payment_date debe ser un objeto { day, month, year }' });
    }
    const prescription = await prescriptionService.createPrescription(data);
    res.status(201).json(prescription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    let data = { ...req.body };
    if (data.date && typeof data.date === 'object') {
      try {
        data.date = parseAndValidateDate(data.date, 'date', true);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    } else if (data.date) {
      return res.status(400).json({ error: 'date debe ser un objeto { day, month, year }' });
    }
    if (data.payment_date && typeof data.payment_date === 'object') {
      try {
        data.payment_date = parseAndValidateDate(data.payment_date, 'payment_date', true);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    } else if (data.payment_date) {
      return res.status(400).json({ error: 'payment_date debe ser un objeto { day, month, year }' });
    }
    const prescription = await prescriptionService.updatePrescription(req.params.id, data);
    res.json(prescription);
  } catch (err) {
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