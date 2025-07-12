const BaseModel = require('../base/BaseModel');
const pool = require('../../config/db');
const { buildPrescriptionFilters } = require('../../filters/sql');
const { buildPaginationAndOrder } = require('../../filters/paginationUtils');

class PrescriptionModel extends BaseModel {
  constructor() {
    super('prescriptions', 'prescription_id');
  }

  async findPrescriptionsWithFilters(query) {
    const { sql, params } = buildPrescriptionFilters(query);
    let fullQuery = `SELECT * FROM ${this.tableName} ${sql}`;
    const { sql: pagSql, params: pagParams } = buildPaginationAndOrder(
      query,
      ['prescription_id', 'patient_id', 'doctor_id', 'date', 'status', 'amount']
    );
    fullQuery += pagSql;
    const [rows] = await pool.query(fullQuery, [...params, ...pagParams]);
    return rows;
  }
}

module.exports = new PrescriptionModel();
