const pool = require('../config/db');

async function getPatientHealthInsurances(patientId) {
  const [rows] = await pool.query(`
    SELECT 
      phi.patient_insurance_id,
      phi.patient_id,
      phi.insurance_id,
      phi.member_number,
      phi.is_primary,
      phi.is_active,
      phi.created_at,
      phi.updated_at,
      hi.name as insurance_name,
      hi.address as insurance_address,
      hi.phone as insurance_phone,
      hi.email as insurance_email
    FROM patient_health_insurances phi
    INNER JOIN health_insurances hi ON phi.insurance_id = hi.insurance_id
    WHERE phi.patient_id = ? AND phi.is_active = TRUE
    ORDER BY phi.is_primary DESC, hi.name ASC
  `, [patientId]);
  
  return rows;
}

async function addHealthInsuranceToPatient(patientId, insuranceId, memberNumber = null, isPrimary = false) {
  // Si se marca como principal, desmarcar las demás
  if (isPrimary) {
    await pool.query(`
      UPDATE patient_health_insurances 
      SET is_primary = FALSE 
      WHERE patient_id = ?
    `, [patientId]);
  }
  
  // Insertar la nueva relación
  const [result] = await pool.query(`
    INSERT INTO patient_health_insurances (patient_id, insurance_id, member_number, is_primary, is_active)
    VALUES (?, ?, ?, ?, TRUE)
  `, [patientId, insuranceId, memberNumber, isPrimary]);
  
  return { patient_insurance_id: result.insertId };
}

async function updatePatientHealthInsurance(patientInsuranceId, data) {
  const { member_number, is_primary, is_active } = data;
  
  // Si se marca como principal, desmarcar las demás del mismo paciente
  if (is_primary) {
    const [current] = await pool.query(`
      SELECT patient_id FROM patient_health_insurances WHERE patient_insurance_id = ?
    `, [patientInsuranceId]);
    
    if (current.length > 0) {
      await pool.query(`
        UPDATE patient_health_insurances 
        SET is_primary = FALSE 
        WHERE patient_id = ? AND patient_insurance_id != ?
      `, [current[0].patient_id, patientInsuranceId]);
    }
  }
  
  // Actualizar la relación
  await pool.query(`
    UPDATE patient_health_insurances 
    SET member_number = ?, is_primary = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
    WHERE patient_insurance_id = ?
  `, [member_number, is_primary, is_active, patientInsuranceId]);
  
  return { patient_insurance_id: patientInsuranceId };
}

async function removeHealthInsuranceFromPatient(patientInsuranceId) {
  // Marcar como inactiva en lugar de eliminar
  await pool.query(`
    UPDATE patient_health_insurances 
    SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
    WHERE patient_insurance_id = ?
  `, [patientInsuranceId]);
  
  return { patient_insurance_id: patientInsuranceId };
}

async function getPrimaryHealthInsurance(patientId) {
  const [rows] = await pool.query(`
    SELECT 
      phi.patient_insurance_id,
      phi.patient_id,
      phi.insurance_id,
      phi.member_number,
      phi.is_primary,
      phi.is_active,
      hi.name as insurance_name,
      hi.address as insurance_address,
      hi.phone as insurance_phone,
      hi.email as insurance_email
    FROM patient_health_insurances phi
    INNER JOIN health_insurances hi ON phi.insurance_id = hi.insurance_id
    WHERE phi.patient_id = ? AND phi.is_primary = TRUE AND phi.is_active = TRUE
    LIMIT 1
  `, [patientId]);
  
  return rows[0] || null;
}

async function setPrimaryHealthInsurance(patientId, insuranceId) {
  // Desmarcar todas las obras sociales del paciente como principales
  await pool.query(`
    UPDATE patient_health_insurances 
    SET is_primary = FALSE 
    WHERE patient_id = ?
  `, [patientId]);
  
  // Marcar la especificada como principal
  await pool.query(`
    UPDATE patient_health_insurances 
    SET is_primary = TRUE 
    WHERE patient_id = ? AND insurance_id = ? AND is_active = TRUE
  `, [patientId, insuranceId]);
  
  return { patient_id: patientId, insurance_id: insuranceId };
}

module.exports = {
  getPatientHealthInsurances,
  addHealthInsuranceToPatient,
  updatePatientHealthInsurance,
  removeHealthInsuranceFromPatient,
  getPrimaryHealthInsurance,
  setPrimaryHealthInsurance
}; 