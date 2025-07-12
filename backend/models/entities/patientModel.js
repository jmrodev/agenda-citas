const BaseModel = require('../base/BaseModel');
const pool = require('../../config/db');
const { buildPersonFilters } = require('../../filters/sql');
const { buildPaginationAndOrder } = require('../../filters/paginationUtils');

class PatientModel extends BaseModel {
  constructor() {
    super('patients', 'patient_id');
  }

  async findPatientsWithFilters(query) {
    const { sql: personFilterSql, params: personParams } = buildPersonFilters(query);

    let joinClause = '';
    if (query.assigned_doctor_id) {
      joinClause = 'INNER JOIN patient_doctors pd ON patients.patient_id = pd.patient_id';
    }

    let fullQuery = `SELECT DISTINCT patients.* FROM ${this.tableName} ${joinClause} ${personFilterSql}`;

    const { sql: pagSql, params: pagParams } = buildPaginationAndOrder(
      query,
      ['patients.patient_id', 'patients.first_name', 'patients.last_name', 'patients.dni', 'patients.address', 'patients.phone', 'patients.email', 'patients.date_of_birth']
    );
    fullQuery += pagSql;

    const finalParams = [...personParams, ...pagParams];
    const [rows] = await pool.query(fullQuery, finalParams);
    return rows;
  }

  async addDoctorsToPatient(patient_id, doctor_ids) {
    if (!Array.isArray(doctor_ids)) return;
    for (const doctor_id of doctor_ids) {
      await pool.query('INSERT INTO patient_doctors (patient_id, doctor_id) VALUES (?, ?)', [patient_id, doctor_id]);
    }
  }

  async getDoctorsByPatientId(patient_id) {
    const [rows] = await pool.query('SELECT doctor_id FROM patient_doctors WHERE patient_id = ?', [patient_id]);
    return rows.map(r => r.doctor_id);
  }

  async removeAllDoctorsFromPatient(patient_id) {
    await pool.query('DELETE FROM patient_doctors WHERE patient_id = ?', [patient_id]);
  }

  async removeDoctorFromPatient(patient_id, doctor_id) {
    await pool.query('DELETE FROM patient_doctors WHERE patient_id = ? AND doctor_id = ?', [patient_id, doctor_id]);
  }

  async getDoctorsForPatientIds(patientIds) {
    if (!patientIds || patientIds.length === 0) {
      return {};
    }
    const query = `
      SELECT pd.patient_id, d.doctor_id, d.first_name, d.last_name, d.specialty, d.email as doctor_email, d.phone as doctor_phone
      FROM doctors d
      INNER JOIN patient_doctors pd ON d.doctor_id = pd.doctor_id
      WHERE pd.patient_id IN (?)
      ORDER BY pd.patient_id, d.last_name, d.first_name;
    `;
    const [rows] = await pool.query(query, [patientIds]);

    const doctorsByPatientId = {};
    rows.forEach(row => {
      if (!doctorsByPatientId[row.patient_id]) {
        doctorsByPatientId[row.patient_id] = [];
      }
      doctorsByPatientId[row.patient_id].push({
        doctor_id: row.doctor_id,
        first_name: row.first_name,
        last_name: row.last_name,
        specialty: row.specialty,
        email: row.doctor_email,
        phone: row.doctor_phone
      });
    });
    return doctorsByPatientId;
  }

  async getPatientReportStats(startDate, endDate) {
    const params = [startDate, endDate];

    const [[{ totalActivePatients }]] = await pool.query(`SELECT COUNT(*) as totalActivePatients FROM ${this.tableName} WHERE date_of_birth IS NOT NULL`);

    const [[{ newPatientsInPeriod }]] = await pool.query(
      `SELECT COUNT(*) as newPatientsInPeriod FROM ${this.tableName} WHERE created_at >= ? AND created_at <= ?`,
      params
    );

    const dateDiff = (new Date(endDate)).getTime() - (new Date(startDate)).getTime();
    const diffDays = Math.ceil(dateDiff / (1000 * 3600 * 24));
    const groupByFormat = diffDays > 60 ? '%Y-%m' : '%Y-%m-%d';

    const [newPatientsByTimePeriodRows] = await pool.query(
      `SELECT DATE_FORMAT(created_at, ?) as period, COUNT(*) as newPatients
       FROM ${this.tableName}
       WHERE created_at >= ? AND created_at <= ?
       GROUP BY period
       ORDER BY period ASC`,
      [groupByFormat, startDate, endDate]
    );
    const newPatientsByTimePeriod = newPatientsByTimePeriodRows.map(row => ({
      period: row.period,
      newPatients: row.newPatients
    }));

    const [[{ averageAge }]] = await pool.query(
      `SELECT AVG(TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE())) as averageAge
       FROM ${this.tableName}
       WHERE date_of_birth IS NOT NULL`
    );

    const ageGroupQuery = `
      SELECT
        SUM(CASE WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 0 AND 18 THEN 1 ELSE 0 END) as '0-18',
        SUM(CASE WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 19 AND 35 THEN 1 ELSE 0 END) as '19-35',
        SUM(CASE WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 36 AND 50 THEN 1 ELSE 0 END) as '36-50',
        SUM(CASE WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 51 AND 65 THEN 1 ELSE 0 END) as '51-65',
        SUM(CASE WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) > 65 THEN 1 ELSE 0 END) as '66+'
      FROM ${this.tableName}
      WHERE date_of_birth IS NOT NULL;
    `;
    const [[ageGroupCounts]] = await pool.query(ageGroupQuery);

    const byAgeGroup = Object.entries(ageGroupCounts).map(([ageGroup, count]) => ({
      ageGroup,
      count: parseInt(count, 10) || 0
    }));

    return {
      summary: {
        totalActivePatients: totalActivePatients || 0,
        newPatientsInPeriod: newPatientsInPeriod || 0,
        averageAge: (typeof averageAge === 'number' && !isNaN(averageAge)) ? averageAge.toFixed(1) : null,
      },
      byTimePeriod: newPatientsByTimePeriod,
      byAgeGroup: byAgeGroup,
    };
  }
}

module.exports = new PatientModel();
