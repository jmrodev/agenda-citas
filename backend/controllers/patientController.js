const patientService = require('../services/patientService');
const userService = require('../services/userService');
const bcrypt = require('bcryptjs');
const { debugPatients } = require('../utils/debug');
const { parseAndValidateDate } = require('../utils/date');

async function getAll(req, res) {
  try {
    // Verificar si hay filtros en la query
    const hasFilters = Object.keys(req.query).length > 0 && 
      Object.values(req.query).some(value => value && value.trim());
    
    let patients;
    if (hasFilters) {
      // Usar filtros avanzados
      patients = await patientService.listPatientsWithFilters(req.query);
    } else {
      // Usar listado normal
      patients = await patientService.listPatients(req.query, req.user);
    }
    
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
    // req.body validado por Joi (createPatientSchema)
    // El esquema Joi maneja el formato de 'birth_date' y la validación condicional de 'doctor_ids'
    let patientData = req.body;

    // Si el rol es doctor, se autoasigna. Esta lógica de negocio permanece.
    if (req.user.role === 'doctor') {
      patientData.doctor_ids = [req.user.entity_id];
    }

    // La conversión de 'birth_date' a 'date_of_birth' (si son nombres diferentes en BD vs input)
    // debería hacerse aquí o en el servicio si Joi solo valida el formato de 'birth_date'.
    // Si el servicio espera 'date_of_birth' y Joi valida 'birth_date':
    if (patientData.birth_date) {
        patientData.date_of_birth = patientData.birth_date; // o el formato que espere el servicio
        delete patientData.birth_date;
    }

    const patient = await patientService.createPatientWithDoctors(patientData);
    res.status(201).json(patient);
  } catch (err) {
    if (err.message.includes('duplicate') || err.message.includes('Ya existe')) { // Ejemplo DNI duplicado
        return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    // req.body validado por Joi (updatePatientSchema)
    const patientId = req.params.id;
    let patientData = req.body;

    // Lógica de autorización (ej. doctor solo edita sus pacientes) debe permanecer si es compleja.
    // Joi no maneja esta lógica de negocio.
    // const current = await patientService.getPatientById(patientId); // Podría ser necesario para validaciones de negocio
    // if (!current) return res.status(404).json({ error: 'Paciente no encontrado' });
    // if (req.user.role === 'doctor' && !current.doctors.some(d => d.doctor_id === req.user.entity_id)) {
    //    return res.status(403).json({ error: 'No autorizado para editar este paciente' });
    // }

    if (patientData.birth_date) {
        patientData.date_of_birth = patientData.birth_date;
        delete patientData.birth_date;
    }

    // El merge anidado para reference_person ya no es necesario si Joi devuelve el objeto completo
    // y el servicio de update puede manejar la actualización parcial de reference_person.
    // Si el servicio espera el objeto completo de reference_person para actualizar, se necesitaría un merge
    // o el servicio debería ser capaz de manejar un objeto parcial de reference_person.
    // Por ahora, se asume que el servicio maneja la actualización de `patientData` como viene de Joi.

    const updatedPatient = await patientService.updatePatient(patientId, patientData);
    if (!updatedPatient) {
        return res.status(404).json({ error: 'Paciente no encontrado para actualizar.' });
    }
    res.json(updatedPatient);
  } catch (err) {
    if (err.message.toLowerCase().includes('not found')) {
        return res.status(404).json({ error: 'Paciente no encontrado.' });
    }
    if (err.message.includes('duplicate')) {
        return res.status(409).json({ error: err.message });
    }
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

// POST /patients/:id/doctors/:doctor_id - agregar relación específica
async function addDoctorToPatient(req, res) {
  try {
    const patientId = req.params.id;
    const doctorId = req.params.doctor_id;
    
    // Verificar que el paciente existe
    const patient = await patientService.getPatientById(patientId);
    if (!patient) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }
    
    // Verificar que el doctor existe
    const doctorService = require('../services/doctorService');
    const doctor = await doctorService.getDoctorById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor no encontrado' });
    }
    
    // Verificar que la relación no existe ya
    const currentDoctors = await patientService.getDoctorsForPatient(patientId);
    const doctorExists = currentDoctors.some(d => d.doctor_id === parseInt(doctorId));
    if (doctorExists) {
      return res.status(409).json({ error: 'El doctor ya está asignado a este paciente' });
    }
    
    // Agregar la relación
    await patientService.addDoctorToPatient(patientId, [parseInt(doctorId)]);
    res.json({ message: 'Doctor agregado correctamente al paciente' });
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

async function getDashboardStats(req, res) {
  debugPatients('getDashboardStats llamado');
  debugPatients('Headers:', req.headers);
  debugPatients('User:', req.user);
  try {
    debugPatients('Llamando a patientService.getDashboardStats()');
    const stats = await patientService.getDashboardStats();
    debugPatients('Stats obtenidas:', stats);
    res.json(stats);
  } catch (err) {
    debugPatients('Error en getDashboardStats:', err);
    res.status(500).json({ error: 'Error al obtener estadísticas de pacientes' });
  }
}

async function getSearchStats(req, res) {
  try {
    const stats = await patientService.getSearchStats(req.query);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getPatientsByDoctor(req, res) {
  try {
    const doctorId = req.params.doctor_id;
    const patients = await patientService.getPatientsByDoctor(doctorId);
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getPatientsByHealthInsurance(req, res) {
  try {
    const insuranceId = req.params.insurance_id;
    const patients = await patientService.getPatientsByHealthInsurance(insuranceId);
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getFilterOptions(req, res) {
  try {
    const options = await patientService.getFilterOptions();
    res.json(options);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getPatientReportSummary(req, res) {
  try {
    const { startDate, endDate, rangeKey } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Los parámetros startDate y endDate son requeridos.' });
    }
    // Validar que startDate y endDate sean fechas válidas si es necesario,
    // o confiar en que el modelo/DB lo maneje.
    // Por ahora, se asume que vienen en formato YYYY-MM-DD.

    const reportData = await patientService.getPatientReportData(startDate, endDate, rangeKey);
    res.json(reportData);
  } catch (err) {
    debugPatients('Error en getPatientReportSummary:', err);
    res.status(500).json({ error: 'Error al obtener el resumen del reporte de pacientes: ' + err.message });
  }
}

module.exports = { getAll, getAllWithFilters, create, update, remove, registerPatientWithUser, getMe, updateMe, getById, updatePatientDoctors, addDoctorToPatient, removeDoctorFromPatient, getDashboardStats, getSearchStats, getPatientsByDoctor, getPatientsByHealthInsurance, getFilterOptions, getPatientReportSummary };