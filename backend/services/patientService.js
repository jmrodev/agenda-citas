const PatientModel = require('../models/entities/patientModel');
const PatientReferenceModel = require('../models/relations/patientReferenceModel');
const PatientHealthInsuranceModel = require('../models/relations/patientHealthInsuranceModel');
const { debugPatients } = require('../utils/debug');
const { buildPersonFilters } = require('../filters/sql');
const pool = require('../config/db');

async function listPatients(query, user) {
  let effectiveQuery = { ...query };

  if (user && user.role === 'doctor' && !effectiveQuery.doctor_id) {
    effectiveQuery.assigned_doctor_id = user.entity_id;
  } else if (effectiveQuery.doctor_id) {
    effectiveQuery.assigned_doctor_id = effectiveQuery.doctor_id;
  }

  const basePatients = await PatientModel.findPatientsWithFilters(effectiveQuery);
  return enrichPatientsDetails(basePatients);
}

async function listPatientsWithFilters(query) {
  const basePatients = await PatientModel.findPatientsWithFilters(query);
  return enrichPatientsDetails(basePatients);
}

async function enrichPatientsDetails(basePatients) {
  if (!basePatients || basePatients.length === 0) {
    return [];
  }
  const patientIds = basePatients.map(p => p.patient_id).filter(id => id != null);

  if (patientIds.length === 0) {
     return basePatients;
  }

  const [doctorsByPatientId, referencesByPatientId] = await Promise.all([
    PatientModel.getDoctorsForPatientIds(patientIds),
    PatientReferenceModel.getReferencesByPatientIds(patientIds)
  ]);

  return basePatients.map(patient => {
    return Object.assign({}, patient, {
      reference_persons: patient && patient.patient_id ? (referencesByPatientId[patient.patient_id] || []) : [],
      doctors: patient && patient.patient_id ? (doctorsByPatientId[patient.patient_id] || []) : []
    });
  });
}

async function createPatient(data) {
  const newPatientRecord = await PatientModel.create(data);
  const fullPatient = await PatientModel.findById(newPatientRecord.patient_id);
  return fullPatient;
}

async function updatePatient(id, data) {
  await PatientModel.update(id, data);
  const updatedPatient = await PatientModel.findById(id);
  return updatedPatient;
}

async function deletePatient(id) {
  return await PatientModel.delete(id);
}

async function getPatientById(id) {
  const patientRow = await PatientModel.findById(id);
  if (!patientRow) return null;

  const doctors = await getDoctorsForPatient(id);
  const references = await PatientReferenceModel.getReferencesByPatientId(id);

  return { ...patientRow, doctors: doctors || [], reference_persons: references || [] };
}

async function getPatientWithReferences(id) {
  const patient = await PatientModel.findById(id);
  if (!patient) return null;
  
  const healthInsurances = await PatientHealthInsuranceModel.getPatientHealthInsurances(id);
  
  const primaryInsurance = healthInsurances.find(hi => hi.is_primary) || healthInsurances[0] || null;
  
  const references = await PatientReferenceModel.getReferencesByPatientId(id);
  const doctors = await getDoctorsForPatient(id);
  
  return { 
    ...patient,
    reference_persons: references || [],
    doctors: doctors || [],
    health_insurances: healthInsurances || [],
    health_insurance_id: primaryInsurance?.insurance_id || patient.health_insurance_id,
    health_insurance_member_number: primaryInsurance?.member_number || patient.health_insurance_member_number,
    health_insurance_name: primaryInsurance?.insurance_name || null,
    health_insurance: primaryInsurance ? {
      insurance_id: primaryInsurance.insurance_id,
      name: primaryInsurance.insurance_name,
      address: primaryInsurance.insurance_address,
      phone: primaryInsurance.insurance_phone,
      email: primaryInsurance.insurance_email
    } : null
  };
}

async function createPatientWithDoctors(data) {
  const newPatientBase = await PatientModel.create(data);

  if (Array.isArray(data.doctor_ids) && data.doctor_ids.length > 0) {
    await PatientModel.addDoctorsToPatient(newPatientBase.patient_id, data.doctor_ids);
  }

  return getPatientWithReferences(newPatientBase.patient_id);
}

async function updatePatientDoctors(patient_id, doctor_ids) {
  await PatientModel.removeAllDoctorsFromPatient(patient_id);
  if (Array.isArray(doctor_ids) && doctor_ids.length > 0) {
    await PatientModel.addDoctorsToPatient(patient_id, doctor_ids);
  }
}

async function addDoctorToPatient(patient_id, doctor_ids) {
  if (!Array.isArray(doctor_ids)) return;
  for (const doctor_id of doctor_ids) {
    await PatientModel.addDoctorsToPatient(patient_id, [doctor_id]);
  }
}

async function removeDoctorFromPatient(patient_id, doctor_id) {
  await PatientModel.removeDoctorFromPatient(patient_id, doctor_id);
}

async function getDoctorsForPatient(patient_id) {
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
    debugPatients('Error en getDoctorsForPatient:', error);
    return [];
  }
}

async function getDashboardStats() {
  debugPatients('getDashboardStats llamado');
  try {
    debugPatients('Llamando a PatientModel.count()');
    const totalPacientes = await PatientModel.count();
    debugPatients('Total pacientes obtenido:', totalPacientes);
    const result = { totalPacientes };
    debugPatients('Resultado final:', result);
    return result;
  } catch (error) {
    debugPatients('Error en getDashboardStats:', error);
    throw error;
  }
}

async function getSearchStats(query) {
  try {
    const { sql, params } = buildPersonFilters(query);
    const countQuery = `SELECT COUNT(*) as total FROM patients ${sql}`;
    const [countRows] = await pool.query(countQuery, params);
    
    return {
      total: countRows[0].total,
      filters: Object.keys(query).filter(key => query[key] && query[key].trim())
    };
  } catch (error) {
    debugPatients('Error en getSearchStats:', error);
    throw error;
  }
}

async function getPatientsByDoctor(doctorId) {
  try {
    const query = `
      SELECT p.* 
      FROM patients p 
      INNER JOIN patient_doctors pd ON p.patient_id = pd.patient_id 
      WHERE pd.doctor_id = ?
    `;
    const [rows] = await pool.query(query, [doctorId]);
    return rows;
  } catch (error) {
    debugPatients('Error en getPatientsByDoctor:', error);
    throw error;
  }
}

async function getPatientsByHealthInsurance(insuranceId) {
  try {
    const query = `
      SELECT p.* 
      FROM patients p 
      WHERE p.health_insurance_id = ?
    `;
    const [rows] = await pool.query(query, [insuranceId]);
    return rows;
  } catch (error) {
    debugPatients('Error en getPatientsByHealthInsurance:', error);
    throw error;
  }
}

async function getFilterOptions() {
  try {
    const [paymentMethods] = await pool.query(`
      SELECT DISTINCT preferred_payment_methods 
      FROM patients 
      WHERE preferred_payment_methods IS NOT NULL AND preferred_payment_methods != ''
    `);
    
    const [relationships] = await pool.query(`
      SELECT DISTINCT reference_relationship 
      FROM patients 
      WHERE reference_relationship IS NOT NULL AND reference_relationship != ''
    `);

    return {
      paymentMethods: paymentMethods.map(p => p.preferred_payment_methods),
      relationships: relationships.map(r => r.reference_relationship)
    };
  } catch (error) {
    debugPatients('Error en getFilterOptions:', error);
    throw error;
  }
}

async function getPatientReportData(startDate, endDate, rangeKey) {
  const reportStats = await PatientModel.getPatientReportStats(startDate, endDate, rangeKey);

  let growthPercentage = 0;
  const activeAtStart = reportStats.summary.totalActivePatients - reportStats.summary.newPatientsInPeriod;
  if (activeAtStart > 0 && reportStats.summary.newPatientsInPeriod > 0) {
    growthPercentage = (reportStats.summary.newPatientsInPeriod / activeAtStart) * 100;
  } else if (reportStats.summary.newPatientsInPeriod > 0) {
    growthPercentage = 100;
  }

  return {
    summary: {
      ...reportStats.summary,
      growthPercentage: parseFloat(growthPercentage.toFixed(1))
    },
    byTimePeriod: reportStats.byTimePeriod,
    byAgeGroup: reportStats.byAgeGroup,
  };
}

module.exports = { 
  listPatients, 
  listPatientsWithFilters, 
  createPatient, 
  updatePatient, 
  deletePatient, 
  getPatientById, 
  getPatientWithReferences, 
  createPatientWithDoctors, 
  updatePatientDoctors, 
  addDoctorToPatient,
  removeDoctorFromPatient, 
  getDoctorsForPatient,
  getDashboardStats, 
  getSearchStats, 
  getPatientsByDoctor, 
  getPatientsByHealthInsurance, 
  getFilterOptions,
  getPatientReportData
};
