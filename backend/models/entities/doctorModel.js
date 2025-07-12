const pool = require('../../config/db');
const BaseModel = require('../base/BaseModel');

class DoctorModel extends BaseModel {
  constructor() {
    super('doctors', 'doctor_id');
  }

  async getPatientsByDoctorId(doctor_id) {
    const [rows] = await pool.query(`
      SELECT p.*
      FROM patients p
      INNER JOIN patient_doctors pd ON p.patient_id = pd.patient_id
      WHERE pd.doctor_id = ?
      ORDER BY p.last_name, p.first_name
    `, [doctor_id]);
    return rows;
  }

  async addPatientsToDoctor(doctor_id, patient_ids) {
    if (!Array.isArray(patient_ids) || patient_ids.length === 0) return;
    const values = patient_ids.map(patient_id => [patient_id, doctor_id]);
    await pool.query('INSERT IGNORE INTO patient_doctors (patient_id, doctor_id) VALUES ?', [values]);
  }

  async removeAllPatientsFromDoctor(doctor_id) {
    await pool.query('DELETE FROM patient_doctors WHERE doctor_id = ?', [doctor_id]);
  }

  async removePatientFromDoctor(doctor_id, patient_id) {
    await pool.query('DELETE FROM patient_doctors WHERE doctor_id = ? AND patient_id = ?', [doctor_id, patient_id]);
  }

  async getDoctorWithPatients(doctor_id) {
    const doctor = await this.findById(doctor_id);
    if (!doctor) {
      return null;
    }

    const patients = await this.getPatientsByDoctorId(doctor_id);
    return { ...doctor, patients: patients || [] };
  }

  async countPatientsByDoctor(doctor_id) {
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM patient_doctors WHERE doctor_id = ?', [doctor_id]);
    return rows[0].total;
  }

  async getDoctorsWithPatientCount() {
    const [rows] = await pool.query(`
      SELECT d.*, COUNT(pd.patient_id) as patient_count
      FROM ${this.tableName} d
      LEFT JOIN patient_doctors pd ON d.doctor_id = pd.doctor_id
      GROUP BY d.doctor_id
      ORDER BY d.last_name, d.first_name
    `);
    return rows;
  }
}

module.exports = new DoctorModel();
