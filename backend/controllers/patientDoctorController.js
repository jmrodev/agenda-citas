const patientDoctorService = require('../services/patientDoctorService');
const { debugPatients } = require('../utils/debug');

/**
 * GET /patient-doctors/patient/:patient_id/doctors
 * Obtiene todos los doctores asignados a un paciente
 */
async function getDoctorsByPatient(req, res) {
  try {
    const patient_id = parseInt(req.params.patient_id);
    const doctors = await patientDoctorService.getDoctorsByPatient(patient_id);
    res.json(doctors);
  } catch (error) {
    debugPatients('Error en getDoctorsByPatient:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /patient-doctors/doctor/:doctor_id/patients
 * Obtiene todos los pacientes asignados a un doctor
 */
async function getPatientsByDoctor(req, res) {
  try {
    const doctor_id = parseInt(req.params.doctor_id);
    const patients = await patientDoctorService.getPatientsByDoctor(doctor_id);
    res.json(patients);
  } catch (error) {
    debugPatients('Error en getPatientsByDoctor:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * PUT /patient-doctors/patient/:patient_id/doctors
 * Asigna doctores a un paciente (reemplaza todas las asignaciones existentes)
 */
async function assignDoctorsToPatient(req, res) {
  try {
    const patient_id = parseInt(req.params.patient_id);
    const { doctor_ids } = req.body;

    if (!Array.isArray(doctor_ids)) {
      return res.status(400).json({ error: 'doctor_ids debe ser un array' });
    }

    const result = await patientDoctorService.assignDoctorsToPatient(patient_id, doctor_ids);
    res.json({ 
      message: 'Doctores asignados correctamente',
      ...result 
    });
  } catch (error) {
    debugPatients('Error en assignDoctorsToPatient:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * PUT /patient-doctors/doctor/:doctor_id/patients
 * Asigna pacientes a un doctor (reemplaza todas las asignaciones existentes)
 */
async function assignPatientsToDoctor(req, res) {
  try {
    const doctor_id = parseInt(req.params.doctor_id);
    const { patient_ids } = req.body;

    if (!Array.isArray(patient_ids)) {
      return res.status(400).json({ error: 'patient_ids debe ser un array' });
    }

    const result = await patientDoctorService.assignPatientsToDoctor(doctor_id, patient_ids);
    res.json({ 
      message: 'Pacientes asignados correctamente',
      ...result 
    });
  } catch (error) {
    debugPatients('Error en assignPatientsToDoctor:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * POST /patient-doctors/patient/:patient_id/doctors/:doctor_id
 * Agrega un doctor específico a un paciente
 */
async function addDoctorToPatient(req, res) {
  try {
    const patient_id = parseInt(req.params.patient_id);
    const doctor_id = parseInt(req.params.doctor_id);

    const result = await patientDoctorService.addDoctorToPatient(patient_id, doctor_id);
    res.json({ 
      message: 'Doctor agregado correctamente',
      ...result 
    });
  } catch (error) {
    debugPatients('Error en addDoctorToPatient:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * POST /patient-doctors/doctor/:doctor_id/patients/:patient_id
 * Agrega un paciente específico a un doctor
 */
async function addPatientToDoctor(req, res) {
  try {
    const doctor_id = parseInt(req.params.doctor_id);
    const patient_id = parseInt(req.params.patient_id);

    const result = await patientDoctorService.addPatientToDoctor(doctor_id, patient_id);
    res.json({ 
      message: 'Paciente agregado correctamente',
      ...result 
    });
  } catch (error) {
    debugPatients('Error en addPatientToDoctor:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * DELETE /patient-doctors/patient/:patient_id/doctors/:doctor_id
 * Elimina un doctor específico de un paciente
 */
async function removeDoctorFromPatient(req, res) {
  try {
    const patient_id = parseInt(req.params.patient_id);
    const doctor_id = parseInt(req.params.doctor_id);

    await patientDoctorService.removeDoctorFromPatient(patient_id, doctor_id);
    res.json({ message: 'Doctor eliminado correctamente' });
  } catch (error) {
    debugPatients('Error en removeDoctorFromPatient:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * DELETE /patient-doctors/doctor/:doctor_id/patients/:patient_id
 * Elimina un paciente específico de un doctor
 */
async function removePatientFromDoctor(req, res) {
  try {
    const doctor_id = parseInt(req.params.doctor_id);
    const patient_id = parseInt(req.params.patient_id);

    await patientDoctorService.removePatientFromDoctor(doctor_id, patient_id);
    res.json({ message: 'Paciente eliminado correctamente' });
  } catch (error) {
    debugPatients('Error en removePatientFromDoctor:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /patient-doctors/stats
 * Obtiene estadísticas de las relaciones paciente-doctor
 */
async function getRelationshipStats(req, res) {
  try {
    const stats = await patientDoctorService.getRelationshipStats();
    res.json(stats);
  } catch (error) {
    debugPatients('Error en getRelationshipStats:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /patient-doctors/doctor/:doctor_id/patients/search
 * Busca pacientes por doctor con filtros
 */
async function searchPatientsByDoctor(req, res) {
  try {
    const doctor_id = parseInt(req.params.doctor_id);
    const filters = req.query;

    const patients = await patientDoctorService.searchPatientsByDoctor(doctor_id, filters);
    res.json(patients);
  } catch (error) {
    debugPatients('Error en searchPatientsByDoctor:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /patient-doctors/patient/:patient_id/doctors/search
 * Busca doctores por paciente con filtros
 */
async function searchDoctorsByPatient(req, res) {
  try {
    const patient_id = parseInt(req.params.patient_id);
    const filters = req.query;

    const doctors = await patientDoctorService.searchDoctorsByPatient(patient_id, filters);
    res.json(doctors);
  } catch (error) {
    debugPatients('Error en searchDoctorsByPatient:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getDoctorsByPatient,
  getPatientsByDoctor,
  assignDoctorsToPatient,
  assignPatientsToDoctor,
  addDoctorToPatient,
  addPatientToDoctor,
  removeDoctorFromPatient,
  removePatientFromDoctor,
  getRelationshipStats,
  searchPatientsByDoctor,
  searchDoctorsByPatient
}; 