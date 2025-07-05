const pool = require('../config/db');

async function getAllDoctors() {
  const [rows] = await pool.query('SELECT * FROM doctors');
  return rows;
}

async function createDoctor(data) {
  const { first_name, last_name, specialty, license_number, phone, email, consultation_fee, prescription_fee, last_earnings_collection_date } = data;
  const [result] = await pool.query(
    'INSERT INTO doctors (first_name, last_name, specialty, license_number, phone, email, consultation_fee, prescription_fee, last_earnings_collection_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [first_name, last_name, specialty, license_number, phone, email, consultation_fee, prescription_fee, last_earnings_collection_date]
  );
  return { doctor_id: result.insertId, ...data };
}

async function updateDoctor(id, data) {
  const { first_name, last_name, specialty, license_number, phone, email, consultation_fee, prescription_fee, last_earnings_collection_date } = data;
  await pool.query(
    'UPDATE doctors SET first_name=?, last_name=?, specialty=?, license_number=?, phone=?, email=?, consultation_fee=?, prescription_fee=?, last_earnings_collection_date=? WHERE doctor_id=?',
    [first_name, last_name, specialty, license_number, phone, email, consultation_fee, prescription_fee, last_earnings_collection_date, id]
  );
  return { doctor_id: id, ...data };
}

async function deleteDoctor(id) {
  await pool.query('DELETE FROM doctors WHERE doctor_id=?', [id]);
  return { doctor_id: id };
}

async function getDoctorById(id) {
  const [rows] = await pool.query('SELECT * FROM doctors WHERE doctor_id = ?', [id]);
  return rows[0] || null;
}

// Nuevos métodos para gestión de relaciones paciente-doctor
async function getPatientsByDoctorId(doctor_id) {
  const [rows] = await pool.query(`
    SELECT p.* 
    FROM patients p 
    INNER JOIN patient_doctors pd ON p.patient_id = pd.patient_id 
    WHERE pd.doctor_id = ?
    ORDER BY p.last_name, p.first_name
  `, [doctor_id]);
  return rows;
}

async function addPatientsToDoctor(doctor_id, patient_ids) {
  if (!Array.isArray(patient_ids)) return;
  for (const patient_id of patient_ids) {
    await pool.query('INSERT INTO patient_doctors (patient_id, doctor_id) VALUES (?, ?)', [patient_id, doctor_id]);
  }
}

async function removeAllPatientsFromDoctor(doctor_id) {
  await pool.query('DELETE FROM patient_doctors WHERE doctor_id = ?', [doctor_id]);
}

async function removePatientFromDoctor(doctor_id, patient_id) {
  await pool.query('DELETE FROM patient_doctors WHERE doctor_id = ? AND patient_id = ?', [doctor_id, patient_id]);
}

async function getDoctorWithPatients(doctor_id) {
  const doctor = await getDoctorById(doctor_id);
  if (!doctor) return null;
  
  const patients = await getPatientsByDoctorId(doctor_id);
  return { ...doctor, patients };
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
  getDoctorsWithPatientCount
}; 