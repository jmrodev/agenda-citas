const PatientModel = require('../models/entities/patientModel');
const DoctorModel = require('../models/entities/doctorModel');
const pool = require('../config/db');
const { debugPatients } = require('../utils/debug');

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

async function assignDoctorsToPatient(patient_id, doctor_ids) {
  try {
    const patient = await PatientModel.findById(patient_id);
    if (!patient) {
      throw new Error('Paciente no encontrado');
    }

    for (const doctor_id of doctor_ids) {
      const doctor = await DoctorModel.findById(doctor_id);
      if (!doctor) {
        throw new Error(`Doctor con ID ${doctor_id} no encontrado`);
      }
    }

    await PatientModel.removeAllDoctorsFromPatient(patient_id);

    if (Array.isArray(doctor_ids) && doctor_ids.length > 0) {
      await PatientModel.addDoctorsToPatient(patient_id, doctor_ids);
    }

    return { patient_id, doctor_ids };
  } catch (error) {
    debugPatients('Error en assignDoctorsToPatient:', error);
    throw error;
  }
}

async function assignPatientsToDoctor(doctor_id, patient_ids) {
  try {
    const doctor = await DoctorModel.findById(doctor_id);
    if (!doctor) {
      throw new Error('Doctor no encontrado');
    }

    for (const patient_id of patient_ids) {
      const patient = await PatientModel.findById(patient_id);
      if (!patient) {
        throw new Error(`Paciente con ID ${patient_id} no encontrado`);
      }
    }

    await DoctorModel.removeAllPatientsFromDoctor(doctor_id);

    if (Array.isArray(patient_ids) && patient_ids.length > 0) {
      await DoctorModel.addPatientsToDoctor(doctor_id, patient_ids);
    }

    return { doctor_id, patient_ids };
  } catch (error) {
    debugPatients('Error en assignPatientsToDoctor:', error);
    throw error;
  }
}

async function addDoctorToPatient(patient_id, doctor_id) {
  try {
    const patient = await PatientModel.findById(patient_id);
    if (!patient) {
      throw new Error('Paciente no encontrado');
    }

    const doctor = await DoctorModel.findById(doctor_id);
    if (!doctor) {
      throw new Error('Doctor no encontrado');
    }

    const [existing] = await pool.query(
      'SELECT 1 FROM patient_doctors WHERE patient_id = ? AND doctor_id = ?',
      [patient_id, doctor_id]
    );

    if (existing.length > 0) {
      throw new Error('El doctor ya está asignado a este paciente');
    }

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

async function addPatientToDoctor(doctor_id, patient_id) {
  try {
    const doctor = await DoctorModel.findById(doctor_id);
    if (!doctor) {
      throw new Error('Doctor no encontrado');
    }

    const patient = await PatientModel.findById(patient_id);
    if (!patient) {
      throw new Error('Paciente no encontrado');
    }

    const [existing] = await pool.query(
      'SELECT 1 FROM patient_doctors WHERE doctor_id = ? AND patient_id = ?',
      [doctor_id, patient_id]
    );

    if (existing.length > 0) {
      throw new Error('El paciente ya está asignado a este doctor');
    }

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

async function removeDoctorFromPatient(patient_id, doctor_id) {
  try {
    const result = await PatientModel.removeDoctorFromPatient(patient_id, doctor_id);
    return result;
  } catch (error) {
    debugPatients('Error en removeDoctorFromPatient:', error);
    throw error;
  }
}

async function removePatientFromDoctor(doctor_id, patient_id) {
  try {
    const result = await DoctorModel.removePatientFromDoctor(doctor_id, patient_id);
    return result;
  } catch (error) {
    debugPatients('Error en removePatientFromDoctor:', error);
    throw error;
  }
}

async function getRelationshipStats() {
  try {
    const [totalRelations] = await pool.query('SELECT COUNT(*) as total FROM patient_doctors');
    
    const [topDoctors] = await pool.query(`
      SELECT d.first_name, d.last_name, COUNT(pd.patient_id) as patient_count
      FROM doctors d
      LEFT JOIN patient_doctors pd ON d.doctor_id = pd.doctor_id
      GROUP BY d.doctor_id
      ORDER BY patient_count DESC
      LIMIT 5
    `);

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

async function searchPatientsByDoctor(doctor_id, filters = {}) {
  try {
    let query = `
      SELECT p.* 
      FROM patients p 
      INNER JOIN patient_doctors pd ON p.patient_id = pd.patient_id 
      WHERE pd.doctor_id = ?
    `;
    const params = [doctor_id];

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

async function searchDoctorsByPatient(patient_id, filters = {}) {
  try {
    let query = `
      SELECT d.* 
      FROM doctors d 
      INNER JOIN patient_doctors pd ON d.doctor_id = pd.doctor_id 
      WHERE pd.patient_id = ?
    `;
    const params = [patient_id];

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
