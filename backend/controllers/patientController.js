const patientService = require('../services/patientService');
const userService = require('../services/userService');
const bcrypt = require('bcryptjs');

async function getAll(req, res) {
  try {
    const patients = await patientService.listPatients();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAllWithFilters(req, res) {
  try {
    const patients = await patientService.listPatientsWithFilters(req.query);
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    const patient = await patientService.createPatient(req.body);
    res.status(201).json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const id = req.params.id;
    const current = await patientService.getPatientById(id);
    if (!current) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }
    // Merge datos existentes con los nuevos
    const merged = { ...current, ...req.body };
    // Merge anidado para reference_person
    if (req.body.reference_person) {
      merged.reference_person = { ...current.reference_person, ...req.body.reference_person };
    }
    const updated = await patientService.updatePatient(id, merged);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    await patientService.deletePatient(req.params.id);
    res.json({ message: 'Paciente eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Crear paciente y usuario paciente juntos
async function registerPatientWithUser(req, res) {
  try {
    const { email, password, ...patientData } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan email o contraseña' });
    }
    // 1. Crear paciente
    const newPatient = await patientService.createPatient(patientData);
    // 2. Crear usuario paciente
    const hashed = await bcrypt.hash(password, 10);
    const user = await userService.registerUser({
      email,
      password: hashed,
      role: 'patient',
      entity_id: newPatient.patient_id
    });
    res.status(201).json({ patient: newPatient, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getMe(req, res) {
  try {
    const patientId = req.user.entity_id;
    const patient = await patientService.getPatientById(patientId);
    if (!patient) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateMe(req, res) {
  try {
    const patientId = req.user.entity_id;
    const current = await patientService.getPatientById(patientId);
    if (!current) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }
    // Merge datos existentes con los nuevos
    const merged = { ...current, ...req.body };
    // Merge anidado para reference_person
    if (req.body.reference_person) {
      merged.reference_person = { ...current.reference_person, ...req.body.reference_person };
    }
    const updated = await patientService.updatePatient(patientId, merged);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getById(req, res) {
  try {
    const patient = await patientService.getPatientWithReferences(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAll, getAllWithFilters, create, update, remove, registerPatientWithUser, getMe, updateMe, getById }; 