const BaseModel = require('../base/BaseModel');
const pool = require('../../config/db');

class PrescriptionMedicationModel extends BaseModel {
  constructor() {
    super('prescription_medications', 'prescription_med_id');
  }

  async medicationBelongsToPrescription(prescription_id, med_id) {
    const [rows] = await pool.query(
      `SELECT 1 FROM ${this.tableName} WHERE prescription_id = ? AND prescription_med_id = ?`,
      [prescription_id, med_id]
    );
    return rows.length > 0;
  }
}

module.exports = new PrescriptionMedicationModel();
