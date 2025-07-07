const pool = require('../config/db');

async function getAllDoctors() {
  const [rows] = await pool.query('SELECT * FROM doctors ORDER BY last_name, first_name');
  return rows;
}

async function createDoctor(data) {
  const { first_name, last_name, specialty, license_number, phone, email, consultation_fee, prescription_fee, last_earnings_collection_date } = data;
  // Asegurarse de que last_earnings_collection_date sea null si no se provee o es inválido después del parseo del controlador/servicio
  const final_last_earnings_collection_date = last_earnings_collection_date || null;

  const [result] = await pool.query(
    'INSERT INTO doctors (first_name, last_name, specialty, license_number, phone, email, consultation_fee, prescription_fee, last_earnings_collection_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [first_name, last_name, specialty, license_number, phone, email, consultation_fee, prescription_fee, final_last_earnings_collection_date]
  );
  // Devolver el objeto completo podría ser útil, o solo el ID y luego el servicio recupera el objeto completo.
  // Por consistencia con getDoctorById, recuperamos el doctor completo.
  return getDoctorById(result.insertId);
}

async function updateDoctor(id, data) {
  const { first_name, last_name, specialty, license_number, phone, email, consultation_fee, prescription_fee, last_earnings_collection_date } = data;
  // Asegurarse de que last_earnings_collection_date sea null si es necesario
  const final_last_earnings_collection_date = last_earnings_collection_date || null;

  const [result] = await pool.query(
    'UPDATE doctors SET first_name=?, last_name=?, specialty=?, license_number=?, phone=?, email=?, consultation_fee=?, prescription_fee=?, last_earnings_collection_date=? WHERE doctor_id=?',
    [first_name, last_name, specialty, license_number, phone, email, consultation_fee, prescription_fee, final_last_earnings_collection_date, id]
  );

  if (result.affectedRows === 0) {
    return null; // O lanzar un error si se prefiere que el servicio lo maneje
  }
  return getDoctorById(id); // Devolver el doctor actualizado
}

async function deleteDoctor(id) {
  // Considerar verificar si el doctor tiene relaciones que impidan el borrado si no hay CASCADE DELETE
  // Sin embargo, el servicio/controlador ya maneja el error ER_ROW_IS_REFERENCED_2
  const [result] = await pool.query('DELETE FROM doctors WHERE doctor_id=?', [id]);
  return result.affectedRows > 0; // Devuelve true si se eliminó, false si no.
}

async function getDoctorById(id) {
  const [rows] = await pool.query('SELECT * FROM doctors WHERE doctor_id = ?', [id]);
  return rows[0] || null;
}

async function getPatientsByDoctorId(doctor_id) {
  // Esta función asume que doctor_id es válido. La existencia del doctor se verifica en el servicio.
  const [rows] = await pool.query(`
    SELECT p.* 
    FROM patients p 
    INNER JOIN patient_doctors pd ON p.patient_id = pd.patient_id 
    WHERE pd.doctor_id = ?
    ORDER BY p.last_name, p.first_name
  `, [doctor_id]);
  return rows; // Devuelve un array (vacío si no hay pacientes)
}

async function addPatientsToDoctor(doctor_id, patient_ids) {
  if (!Array.isArray(patient_ids) || patient_ids.length === 0) return;
  const values = patient_ids.map(patient_id => [patient_id, doctor_id]);
  // Usar IGNORE para evitar errores si la relación ya existe, aunque el servicio debería verificarlo.
  await pool.query('INSERT IGNORE INTO patient_doctors (patient_id, doctor_id) VALUES ?', [values]);
}

async function removeAllPatientsFromDoctor(doctor_id) {
  await pool.query('DELETE FROM patient_doctors WHERE doctor_id = ?', [doctor_id]);
}

async function removePatientFromDoctor(doctor_id, patient_id) {
  await pool.query('DELETE FROM patient_doctors WHERE doctor_id = ? AND patient_id = ?', [doctor_id, patient_id]);
}

async function getDoctorWithPatients(doctor_id) {
  const doctor = await getDoctorById(doctor_id);
  if (!doctor) {
    return null; // Doctor no encontrado
  }
  
  const patients = await getPatientsByDoctorId(doctor_id);
  // No es necesario verificar si patients es null, ya que getPatientsByDoctorId devuelve [] si no hay.
  return { ...doctor, patients: patients || [] }; // Asegurar que patients siempre sea un array
}

async function countPatientsByDoctor(doctor_id) {
  const [rows] = await pool.query('SELECT COUNT(*) as total FROM patient_doctors WHERE doctor_id = ?', [doctor_id]);
  return rows[0].total;
}

async function getDoctorsWithPatientCount() {
  const [rows] = await pool.query(`
    SELECT d.*, COUNT(pd.patient_id) as patient_count
    FROM doctors d
    LEFT JOIN patient_doctors pd ON d.doctor_id = pd.doctor_id
    GROUP BY d.doctor_id
    ORDER BY d.last_name, d.first_name
  `);
  return rows;
}

// Nueva función para contar doctores
async function countDoctors() {
  const [rows] = await pool.query('SELECT COUNT(*) as totalDoctores FROM doctors');
  return rows[0].totalDoctores;
}

module.exports = { 
  getAllDoctors, 
  createDoctor, 
  updateDoctor, 
  deleteDoctor, 
  getDoctorById,
  getPatientsByDoctorId,
  addPatientsToDoctor,
  removeAllPatientsFromDoctor,
  removePatientFromDoctor,
  getDoctorWithPatients,
  countPatientsByDoctor,
  getDoctorsWithPatientCount,
  countDoctors // Exportar la nueva función
}; 