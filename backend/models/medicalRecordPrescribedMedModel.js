const pool = require('../config/db');

async function medBelongsToRecord(record_id, med_id) {
  const [rows] = await pool.query(
    'SELECT 1 FROM medical_record_prescribed_meds WHERE record_id = ? AND med_record_med_id = ?',
    [record_id, med_id]
  );
  return rows.length > 0;
}

async function getPrescribedMedsByRecordId(record_id) {
  const [rows] = await pool.query(
    'SELECT * FROM medical_record_prescribed_meds WHERE record_id = ?',
    [record_id]
  );
  return rows;
}

async function createPrescribedMed({ record_id, medication_name, dose, instructions }) {
  const [result] = await pool.query(
    'INSERT INTO medical_record_prescribed_meds (record_id, medication_name, dose, instructions) VALUES (?, ?, ?, ?)',
    [record_id, medication_name, dose, instructions]
  );
  return {
    med_record_med_id: result.insertId,
    record_id,
    medication_name,
    dose,
    instructions
  };
}

module.exports.medBelongsToRecord = medBelongsToRecord;
module.exports.getPrescribedMedsByRecordId = getPrescribedMedsByRecordId;
module.exports.createPrescribedMed = createPrescribedMed; 