const patientModel = require('../models/patientModel');
const doctorModel = require('../models/doctorModel');
const pool = require('../config/db');
const { debugPatients } = require('../utils/debug');

/**
 * Obtiene todos los doctores asignados a un paciente
 */
async function getDoctorsByPatient(patient_id) {
  try {
    const [rows] = await pool.query(`
      SELECT d.* 
      FROM doctors d 
      INNER JOIN patient_doctors pd ON d.doctor_id = pd.doctor_id 
      WHERE pd.patient_id = ?
      ORDER BY d.last_name, d.first_name
    `, [patient_id]);
    return rows;
  } catch (error) {
    debugPatients('Error en getDoctorsByPatient:', error);
    throw error;
  }
}

/**
 * Obtiene todos los pacientes asignados a un doctor
 */
async function getPatientsByDoctor(doctor_id) {
  try {
    const [rows] = await pool.query(`
      SELECT p.* 
      FROM patients p 
      INNER JOIN patient_doctors pd ON p.patient_id = pd.patient_id 
      WHERE pd.doctor_id = ?
      ORDER BY p.last_name, p.first_name
    `, [doctor_id]);
    return rows;
  } catch (error) {
    debugPatients('Error en getPatientsByDoctor:', error);
    throw error;
  }
}

/**
 * Asigna doctores a un paciente (reemplaza todas las asignaciones existentes)
 */
async function assignDoctorsToPatient(patient_id, doctor_ids) {
  try {
    // Verificar que el paciente existe
    const patient = await patientModel.getPatientById(patient_id);
    if (!patient) {
      throw new Error('Paciente no encontrado');
    }

    // Verificar que todos los doctores existen
    for (const doctor_id of doctor_ids) {
      const doctor = await doctorModel.getDoctorById(doctor_id);
      if (!doctor) {
        throw new Error(`Doctor con ID ${doctor_id} no encontrado`);
      }
    }

    // Eliminar asignaciones existentes
    await patientModel.removeAllDoctorsFromPatient(patient_id);

    // Agregar nuevas asignaciones
    if (Array.isArray(doctor_ids) && doctor_ids.length > 0) {
      await patientModel.addDoctorsToPatient(patient_id, doctor_ids);
    }

    return { patient_id, doctor_ids };
  } catch (error) {
    debugPatients('Error en assignDoctorsToPatient:', error);
    throw error;
  }
}

/**
 * Asigna pacientes a un doctor (reemplaza todas las asignaciones existentes)
 */
async function assignPatientsToDoctor(doctor_id, patient_ids) {
  try {
    // Verificar que el doctor existe
    const doctor = await doctorModel.getDoctorById(doctor_id);
    if (!doctor) {
      throw new Error('Doctor no encontrado');
    }

    // Verificar que todos los pacientes existen
    for (const patient_id of patient_ids) {
      const patient = await patientModel.getPatientById(patient_id);
      if (!patient) {
        throw new Error(`Paciente con ID ${patient_id} no encontrado`);
      }
    }

    // Eliminar asignaciones existentes
    await doctorModel.removeAllPatientsFromDoctor(doctor_id);

    // Agregar nuevas asignaciones
    if (Array.isArray(patient_ids) && patient_ids.length > 0) {
      await doctorModel.addPatientsToDoctor(doctor_id, patient_ids);
    }

    return { doctor_id, patient_ids };
  } catch (error) {
    debugPatients('Error en assignPatientsToDoctor:', error);
    throw error;
  }
}

/**
 * Agrega un doctor específico a un paciente
 */
async function addDoctorToPatient(patient_id, doctor_id) {
  try {
    // Verificar que ambos existen
    const patient = await patientModel.getPatientById(patient_id);
    if (!patient) {
      throw new Error('Paciente no encontrado');
    }

    const doctor = await doctorModel.getDoctorById(doctor_id);
    if (!doctor) {
      throw new Error('Doctor no encontrado');
    }

    // Verificar que la relación no existe ya
    const [existing] = await pool.query(
      'SELECT 1 FROM patient_doctors WHERE patient_id = ? AND doctor_id = ?',
      [patient_id, doctor_id]
    );

    if (existing.length > 0) {
      throw new Error('El doctor ya está asignado a este paciente');
    }

    // Agregar la relación
    await pool.query(
      'INSERT INTO patient_doctors (patient_id, doctor_id) VALUES (?, ?)',
      [patient_id, doctor_id]
    );

    return { patient_id, doctor_id };
  } catch (error) {
    debugPatients('Error en addDoctorToPatient:', error);
    throw error;
  }
}

/**
 * Agrega un paciente específico a un doctor
 */
async function addPatientToDoctor(doctor_id, patient_id) {
  try {
    // Verificar que ambos existen
    const doctor = await doctorModel.getDoctorById(doctor_id);
    if (!doctor) {
      throw new Error('Doctor no encontrado');
    }

    const patient = await patientModel.getPatientById(patient_id);
    if (!patient) {
      throw new Error('Paciente no encontrado');
    }

    // Verificar que la relación no existe ya
    const [existing] = await pool.query(
      'SELECT 1 FROM patient_doctors WHERE doctor_id = ? AND patient_id = ?',
      [doctor_id, patient_id]
    );

    if (existing.length > 0) {
      throw new Error('El paciente ya está asignado a este doctor');
    }

    // Agregar la relación
    await pool.query(
      'INSERT INTO patient_doctors (patient_id, doctor_id) VALUES (?, ?)',
      [patient_id, doctor_id]
    );

    return { doctor_id, patient_id };
  } catch (error) {
    debugPatients('Error en addPatientToDoctor:', error);
    throw error;
  }
}

/**
 * Elimina un doctor específico de un paciente
 */
async function removeDoctorFromPatient(patient_id, doctor_id) {
  try {
    const result = await patientModel.removeDoctorFromPatient(patient_id, doctor_id);
    return result;
  } catch (error) {
    debugPatients('Error en removeDoctorFromPatient:', error);
    throw error;
  }
}

/**
 * Elimina un paciente específico de un doctor
 */
async function removePatientFromDoctor(doctor_id, patient_id) {
  try {
    const result = await doctorModel.removePatientFromDoctor(doctor_id, patient_id);
    return result;
  } catch (error) {
    debugPatients('Error en removePatientFromDoctor:', error);
    throw error;
  }
}

/**
 * Obtiene estadísticas de relaciones paciente-doctor
 */
async function getRelationshipStats() {
  try {
    // Total de relaciones
    const [totalRelations] = await pool.query('SELECT COUNT(*) as total FROM patient_doctors');
    
    // Doctores con más pacientes
    const [topDoctors] = await pool.query(`
      SELECT d.first_name, d.last_name, COUNT(pd.patient_id) as patient_count
      FROM doctors d
      LEFT JOIN patient_doctors pd ON d.doctor_id = pd.doctor_id
      GROUP BY d.doctor_id
      ORDER BY patient_count DESC
      LIMIT 5
    `);

    // Pacientes con más doctores
    const [topPatients] = await pool.query(`
      SELECT p.first_name, p.last_name, COUNT(pd.doctor_id) as doctor_count
      FROM patients p
      LEFT JOIN patient_doctors pd ON p.patient_id = pd.patient_id
      GROUP BY p.patient_id
      ORDER BY doctor_count DESC
      LIMIT 5
    `);

    return {
      totalRelations: totalRelations[0].total,
      topDoctors,
      topPatients
    };
  } catch (error) {
    debugPatients('Error en getRelationshipStats:', error);
    throw error;
  }
}

/**
 * Busca pacientes por doctor con filtros
 */
async function searchPatientsByDoctor(doctor_id, filters = {}) {
  try {
    let query = `
      SELECT p.* 
      FROM patients p 
      INNER JOIN patient_doctors pd ON p.patient_id = pd.patient_id 
      WHERE pd.doctor_id = ?
    `;
    const params = [doctor_id];

    // Aplicar filtros
    if (filters.search) {
      query += ` AND (p.first_name LIKE ? OR p.last_name LIKE ? OR p.email LIKE ? OR p.dni LIKE ?)`;
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (filters.health_insurance_id) {
      query += ` AND p.health_insurance_id = ?`;
      params.push(filters.health_insurance_id);
    }

    query += ` ORDER BY p.last_name, p.first_name`;

    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    debugPatients('Error en searchPatientsByDoctor:', error);
    throw error;
  }
}

/**
 * Busca doctores por paciente con filtros
 */
async function searchDoctorsByPatient(patient_id, filters = {}) {
  try {
    let query = `
      SELECT d.* 
      FROM doctors d 
      INNER JOIN patient_doctors pd ON d.doctor_id = pd.doctor_id 
      WHERE pd.patient_id = ?
    `;
    const params = [patient_id];

    // Aplicar filtros
    if (filters.search) {
      query += ` AND (d.first_name LIKE ? OR d.last_name LIKE ? OR d.specialty LIKE ?)`;
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.specialty) {
      query += ` AND d.specialty = ?`;
      params.push(filters.specialty);
    }

    query += ` ORDER BY d.last_name, d.first_name`;

    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    debugPatients('Error en searchDoctorsByPatient:', error);
    throw error;
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