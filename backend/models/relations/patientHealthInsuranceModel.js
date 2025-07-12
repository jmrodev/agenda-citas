const BaseModel = require('../base/BaseModel');
const pool = require('../../config/db');

class PatientHealthInsuranceModel extends BaseModel {
  constructor() {
    super('patient_health_insurances', 'patient_insurance_id');
  }

  async getPatientHealthInsurances(patientId) {
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
      FROM ${this.tableName} phi
      INNER JOIN health_insurances hi ON phi.insurance_id = hi.insurance_id
      WHERE phi.patient_id = ? AND phi.is_active = TRUE
      ORDER BY phi.is_primary DESC, hi.name ASC
    `, [patientId]);

    return rows;
  }

  async addHealthInsuranceToPatient(patientId, insuranceId, memberNumber = null, isPrimary = false) {
    if (isPrimary) {
      await pool.query(`
        UPDATE ${this.tableName}
        SET is_primary = FALSE
        WHERE patient_id = ?
      `, [patientId]);
    }

    const result = await this.create({
      patient_id: patientId,
      insurance_id: insuranceId,
      member_number: memberNumber,
      is_primary: isPrimary,
      is_active: true
    });

    return result;
  }

  async updatePatientHealthInsurance(patientInsuranceId, data) {
    const { member_number, is_primary, is_active } = data;

    if (is_primary) {
      const [current] = await pool.query(`
        SELECT patient_id FROM ${this.tableName} WHERE patient_insurance_id = ?
      `, [patientInsuranceId]);

      if (current.length > 0) {
        await pool.query(`
          UPDATE ${this.tableName}
          SET is_primary = FALSE
          WHERE patient_id = ? AND patient_insurance_id != ?
        `, [current[0].patient_id, patientInsuranceId]);
      }
    }

    await this.update(patientInsuranceId, {
      member_number,
      is_primary,
      is_active,
      updated_at: new Date()
    });

    return { patient_insurance_id: patientInsuranceId };
  }

  async removeHealthInsuranceFromPatient(patientInsuranceId) {
    await this.update(patientInsuranceId, {
      is_active: false,
      updated_at: new Date()
    });

    return { patient_insurance_id: patientInsuranceId };
  }

  async getPrimaryHealthInsurance(patientId) {
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
      FROM ${this.tableName} phi
      INNER JOIN health_insurances hi ON phi.insurance_id = hi.insurance_id
      WHERE phi.patient_id = ? AND phi.is_primary = TRUE AND phi.is_active = TRUE
      LIMIT 1
    `, [patientId]);

    return rows[0] || null;
  }

  async setPrimaryHealthInsurance(patientId, insuranceId) {
    await pool.query(`
      UPDATE ${this.tableName}
      SET is_primary = FALSE
      WHERE patient_id = ?
    `, [patientId]);

    await pool.query(`
      UPDATE ${this.tableName}
      SET is_primary = TRUE
      WHERE patient_id = ? AND insurance_id = ? AND is_active = TRUE
    `, [patientId, insuranceId]);

    return { patient_id: patientId, insurance_id: insuranceId };
  }
}

module.exports = new PatientHealthInsuranceModel();
