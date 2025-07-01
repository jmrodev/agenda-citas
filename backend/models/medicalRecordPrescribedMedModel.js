async function medBelongsToRecord(record_id, med_id) {
  const [rows] = await pool.query(
    'SELECT 1 FROM medical_record_prescribed_meds WHERE record_id = ? AND med_record_med_id = ?',
    [record_id, med_id]
  );
  return rows.length > 0;
}

module.exports.medBelongsToRecord = medBelongsToRecord; 