const BaseModel = require('../base/BaseModel');
const pool = require('../../config/db');

class HealthInsuranceModel extends BaseModel {
  constructor() {
    super('health_insurances', 'insurance_id');
  }

  async getHealthInsuranceReferences(id) {
    console.log('🔍 [HealthInsuranceModel] Buscando referencias para obra social ID:', id);

    const [patients] = await pool.query(`
      SELECT patient_id, first_name, last_name, email
      FROM patients
      WHERE health_insurance_id = ?
    `, [id]);

    console.log('🔍 [HealthInsuranceModel] Pacientes encontrados:', patients.length);

    const [doctors] = await pool.query(`
      SELECT d.doctor_id, d.first_name, d.last_name, d.email
      FROM doctors d
      JOIN doctor_health_insurances dhi ON d.doctor_id = dhi.doctor_id
      WHERE dhi.insurance_id = ?
    `, [id]);

    console.log('🔍 [HealthInsuranceModel] Doctores encontrados:', doctors.length);

    const result = { patients, doctors };
    console.log('🔍 [HealthInsuranceModel] Resultado final:', result);

    return result;
  }

  async deleteHealthInsurance(id, action = 'delete') {
    if (action === 'orphan') {
      let orphanInsuranceId;
      const [existing] = await pool.query('SELECT insurance_id FROM health_insurances WHERE name = ?', ['Sin Obra Social']);

      if (existing.length > 0) {
        orphanInsuranceId = existing[0].insurance_id;
      } else {
        const [result] = await pool.query(
          'INSERT INTO health_insurances (name, address, phone, email) VALUES (?, ?, ?, ?)',
          ['Sin Obra Social', 'Sin dirección', 'Sin teléfono', 'sin.obra.social@clinica.com']
        );
        orphanInsuranceId = result.insertId;
      }

      await pool.query('UPDATE patients SET health_insurance_id = ? WHERE health_insurance_id = ?', [orphanInsuranceId, id]);

      await pool.query('DELETE FROM doctor_health_insurances WHERE insurance_id = ?', [id]);
    } else {
      await pool.query('UPDATE patients SET health_insurance_id = NULL WHERE health_insurance_id = ?', [id]);
      await pool.query('DELETE FROM doctor_health_insurances WHERE insurance_id = ?', [id]);
    }

    await this.delete(id);
    return { insurance_id: id };
  }
}

module.exports = new HealthInsuranceModel();
