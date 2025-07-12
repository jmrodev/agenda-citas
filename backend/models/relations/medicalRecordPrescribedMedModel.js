const BaseModel = require('../base/BaseModel');
const pool = require('../../config/db');

class MedicalRecordPrescribedMedModel extends BaseModel {
  constructor() {
    super('medical_record_prescribed_meds', 'med_record_med_id');
  }

  async medBelongsToRecord(record_id, med_id) {
    const [rows] = await pool.query(
      `SELECT 1 FROM ${this.tableName} WHERE record_id = ? AND med_record_med_id = ?`,
      [record_id, med_id]
    );
    return rows.length > 0;
  }

  async getPrescribedMedsByRecordId(record_id) {
    return this.findAllByField('record_id', record_id);
  }
}

module.exports = new MedicalRecordPrescribedMedModel();
