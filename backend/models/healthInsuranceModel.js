const pool = require('../config/db');
const { buildHealthInsuranceFilters } = require('../filters/sql');
const { buildPaginationAndOrder } = require('../filters/paginationUtils');

async function getAllHealthInsurances() {
  const [rows] = await pool.query('SELECT * FROM health_insurances');
  return rows;
}

async function createHealthInsurance(data) {
  const { name, address, phone, email } = data;
  const [result] = await pool.query(
    'INSERT INTO health_insurances (name, address, phone, email) VALUES (?, ?, ?, ?)',
    [name, address, phone, email]
  );
  return { insurance_id: result.insertId, ...data };
}

async function updateHealthInsurance(id, data) {
  const { name, address, phone, email } = data;
  await pool.query(
    'UPDATE health_insurances SET name=?, address=?, phone=?, email=? WHERE insurance_id=?',
    [name, address, phone, email, id]
  );
  return { insurance_id: id, ...data };
}

async function getHealthInsuranceReferences(id) {
  console.log('🔍 [HealthInsuranceModel] Buscando referencias para obra social ID:', id);
  
  // Obtener pacientes que referencian esta obra social
  const [patients] = await pool.query(`
    SELECT patient_id, first_name, last_name, email 
    FROM patients 
    WHERE health_insurance_id = ?
  `, [id]);
  
  console.log('🔍 [HealthInsuranceModel] Pacientes encontrados:', patients.length);
  
  // Obtener doctores que referencian esta obra social
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

async function deleteHealthInsurance(id, action = 'delete') {
  if (action === 'orphan') {
    // Crear o obtener la obra social "Sin Obra Social"
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
    
    // Actualizar pacientes para asignarles la obra social "Sin Obra Social"
    await pool.query('UPDATE patients SET health_insurance_id = ? WHERE health_insurance_id = ?', [orphanInsuranceId, id]);
    
    // Eliminar las relaciones doctor-obra social
    await pool.query('DELETE FROM doctor_health_insurances WHERE insurance_id = ?', [id]);
  } else {
    // Eliminación normal: quitar referencias
    await pool.query('UPDATE patients SET health_insurance_id = NULL WHERE health_insurance_id = ?', [id]);
    await pool.query('DELETE FROM doctor_health_insurances WHERE insurance_id = ?', [id]);
  }
  
  // Finalmente, eliminar la obra social
  await pool.query('DELETE FROM health_insurances WHERE insurance_id=?', [id]);
  return { insurance_id: id };
}

async function getHealthInsuranceById(id) {
  const [rows] = await pool.query('SELECT * FROM health_insurances WHERE insurance_id = ?', [id]);
  return rows[0];
}

module.exports = { getAllHealthInsurances, createHealthInsurance, updateHealthInsurance, deleteHealthInsurance, getHealthInsuranceById, getHealthInsuranceReferences };