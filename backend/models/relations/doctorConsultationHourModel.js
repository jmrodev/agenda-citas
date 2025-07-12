const BaseModel = require('../base/BaseModel');
const pool = require('../../config/db');

class DoctorConsultationHourModel extends BaseModel {
  constructor() {
    super('doctor_consultation_hours', 'consultation_hour_id');
  }

  async getConsultationHoursByDoctorAndDay(doctor_id, day_of_week) {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.tableName} WHERE doctor_id = ? AND day_of_week = ?`,
      [doctor_id, day_of_week]
    );
    return rows;
  }
}

module.exports = new DoctorConsultationHourModel();
