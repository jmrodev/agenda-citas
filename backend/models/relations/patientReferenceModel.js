const BaseModel = require('../base/BaseModel');
const pool = require('../../config/db');
const { buildReferencePersonFilters } = require('../../filters/sql');
const { buildPaginationAndOrder } = require('../../filters/paginationUtils');

class PatientReferenceModel extends BaseModel {
  constructor() {
    super('patient_references', 'reference_id');
  }

  async existsReferenceByDni(patient_id, dni) {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.tableName} WHERE patient_id = ? AND dni = ?`,
      [patient_id, dni]
    );
    return rows.length > 0;
  }

  async getReferencesByPatientId(patient_id) {
    return this.findAllByField('patient_id', patient_id);
  }

  async findReferencePersonsWithFilters(query) {
    const { sql, params } = buildReferencePersonFilters(query);
    let fullQuery = `SELECT * FROM ${this.tableName} ${sql}`;
    const { sql: pagSql, params: pagParams } = buildPaginationAndOrder(
      query,
      ['reference_id', 'patient_id', 'dni', 'nombre', 'apellido', 'telefono', 'direccion', 'parentesco']
    );
    fullQuery += pagSql;
    const [rows] = await pool.query(fullQuery, [...params, ...pagParams]);
    return rows;
  }

  async addReference(patient_id, data) {
    const { dni, name, last_name, address, phone, relationship } = data;
    if (await this.existsReferenceByDni(patient_id, dni)) {
      const err = new Error('Ya existe una persona de referencia con ese DNI para este paciente');
      err.code = 'DUPLICATE_DNI';
      throw err;
    }
    return this.create({ patient_id, dni, name, last_name, address, phone, relationship });
  }

  async referenceBelongsToPatient(patient_id, reference_id) {
    const [rows] = await pool.query(
      `SELECT 1 FROM ${this.tableName} WHERE patient_id = ? AND reference_id = ?`,
      [patient_id, reference_id]
    );
    return rows.length > 0;
  }

  async getReferencesByPatientIds(patientIds) {
    if (!patientIds || patientIds.length === 0) {
      return {};
    }
    const query = `
      SELECT *
      FROM ${this.tableName}
      WHERE patient_id IN (?)
      ORDER BY patient_id, last_name, name;
    `;
    const [rows] = await pool.query(query, [patientIds]);

    const referencesByPatientId = {};
    rows.forEach(row => {
      if (!referencesByPatientId[row.patient_id]) {
        referencesByPatientId[row.patient_id] = [];
      }
      referencesByPatientId[row.patient_id].push(row);
    });
    return referencesByPatientId;
  }
}

module.exports = new PatientReferenceModel();
