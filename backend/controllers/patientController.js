const patientService = require('../services/patientService');
const userService = require('../services/userService');
const bcrypt = require('bcryptjs');

async function getAll(req, res) {
  try {
    const patients = await patientService.listPatients(req.query, req.user);
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
    let patientData = { ...req.body };
    // Permitir múltiples doctores: doctor_ids debe ser un array
    if (req.user.role === 'doctor') {
      patientData.doctor_ids = [req.user.entity_id];
    }
    if (req.user.role === 'secretary') {
      if (!Array.isArray(patientData.doctor_ids) || patientData.doctor_ids.length === 0) {
        return res.status(400).json({ error: 'Debe asignar al menos un doctor al paciente' });
      }
    }
    // Guardar la relación paciente-doctor en una tabla intermedia (debe implementarse en el modelo/servicio)
    const patient = await patientService.createPatientWithDoctors(patientData);
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
    // Restricción para doctor
    if (req.user.role === 'doctor' && current.doctor_id !== req.user.entity_id) {
      return res.status(403).json({ error: 'No autorizado para editar este paciente' });
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
    // Restricción para doctor
    if (req.user.role === 'doctor' && patient.doctor_id !== req.user.entity_id) {
      return res.status(403).json({ error: 'No autorizado para ver este paciente' });
    }
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PUT /patients/:id/doctors - reasignar todos los doctores de un paciente
async function updatePatientDoctors(req, res) {
  try {
    const patientId = req.params.id;
    const { doctor_ids } = req.body;
    if (!Array.isArray(doctor_ids) || doctor_ids.length === 0) {
      return res.status(400).json({ error: 'Debe asignar al menos un doctor al paciente' });
    }
    await patientService.updatePatientDoctors(patientId, doctor_ids);
    res.json({ message: 'Doctores reasignados correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE /patients/:id/doctors/:doctor_id - eliminar relación específica
async function removeDoctorFromPatient(req, res) {
  try {
    const patientId = req.params.id;
    const doctorId = req.params.doctor_id;
    await patientService.removeDoctorFromPatient(patientId, doctorId);
    res.json({ message: 'Relación paciente-doctor eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAll, getAllWithFilters, create, update, remove, registerPatientWithUser, getMe, updateMe, getById, updatePatientDoctors, removeDoctorFromPatient }; 