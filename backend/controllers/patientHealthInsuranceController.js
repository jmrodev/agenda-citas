const patientHealthInsuranceService = require('../services/patientHealthInsuranceService');

async function getPatientHealthInsurances(req, res) {
  try {
    const patientId = req.params.patientId;
    const insurances = await patientHealthInsuranceService.getPatientHealthInsurances(patientId);
    res.json(insurances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function addHealthInsuranceToPatient(req, res) {
  try {
    const patientId = req.params.patientId;
    const { insurance_id, member_number, is_primary } = req.body;
    
    if (!insurance_id) {
      return res.status(400).json({ error: 'Se requiere insurance_id' });
    }
    
    const result = await patientHealthInsuranceService.addHealthInsuranceToPatient(
      patientId, 
      insurance_id, 
      member_number, 
      is_primary || false
    );
    
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updatePatientHealthInsurance(req, res) {
  try {
    const patientInsuranceId = req.params.patientInsuranceId;
    const data = req.body;
    
    const result = await patientHealthInsuranceService.updatePatientHealthInsurance(patientInsuranceId, data);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function removeHealthInsuranceFromPatient(req, res) {
  try {
    const patientInsuranceId = req.params.patientInsuranceId;
    
    const result = await patientHealthInsuranceService.removeHealthInsuranceFromPatient(patientInsuranceId);
    res.json({ message: 'Obra social removida del paciente', ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getPrimaryHealthInsurance(req, res) {
  try {
    const patientId = req.params.patientId;
    const insurance = await patientHealthInsuranceService.getPrimaryHealthInsurance(patientId);
    
    if (!insurance) {
      return res.status(404).json({ error: 'No se encontró obra social principal para este paciente' });
    }
    
    res.json(insurance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function setPrimaryHealthInsurance(req, res) {
  try {
    const patientId = req.params.patientId;
    const { insurance_id } = req.body;
    
    if (!insurance_id) {
      return res.status(400).json({ error: 'Se requiere insurance_id' });
    }
    
    const result = await patientHealthInsuranceService.setPrimaryHealthInsurance(patientId, insurance_id);
    res.json({ message: 'Obra social principal actualizada', ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getPatientHealthInsurances,
  addHealthInsuranceToPatient,
  updatePatientHealthInsurance,
  removeHealthInsuranceFromPatient,
  getPrimaryHealthInsurance,
  setPrimaryHealthInsurance
}; 