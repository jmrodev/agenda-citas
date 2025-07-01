async function medicationBelongsToPrescription(prescription_id, med_id) {
  const [rows] = await pool.query(
    'SELECT 1 FROM prescription_medications WHERE prescription_id = ? AND prescription_med_id = ?',
    [prescription_id, med_id]
  );
  return rows.length > 0;
}

module.exports.medicationBelongsToPrescription = medicationBelongsToPrescription; 