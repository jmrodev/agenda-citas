const BaseModel = require('../base/BaseModel');
const pool = require('../../config/db');
const { buildMedicalHistoryFilters } = require('../../filters/sql');
const { buildPaginationAndOrder } = require('../../filters/paginationUtils');

class MedicalHistoryModel extends BaseModel {
  constructor() {
    super('medical_history_records', 'record_id');
  }

  async findMedicalHistoriesWithFilters(query) {
    const { sql, params } = buildMedicalHistoryFilters(query);
    let fullQuery = `SELECT * FROM ${this.tableName} ${sql}`;
    const { sql: pagSql, params: pagParams } = buildPaginationAndOrder(
      query,
      ['historial_id', 'paciente_id', 'doctor_id', 'fecha', 'diagnostico']
    );
    fullQuery += pagSql;
    const [rows] = await pool.query(fullQuery, [...params, ...pagParams]);
    return rows;
  }

  async getMedicalHistoryReportStats(startDate, endDate) {
    const params = [startDate, endDate];

    let newRecordsInPeriod = 0;
    try {
      const [[result]] = await pool.query(
        `SELECT COUNT(*) as count FROM ${this.tableName} WHERE created_at >= ? AND created_at <= ?`,
        params
      );
      newRecordsInPeriod = result.count || 0;
    } catch (err) {
      console.error("Query para newRecordsInPeriod falló. Probablemente created_at no existe. Msg:", err.message);
      newRecordsInPeriod = 'Error (campo created_at?)';
    }

    let updatedRecordsInPeriod = 0;
    try {
      const [[result]] = await pool.query(
        `SELECT COUNT(*) as count FROM ${this.tableName} WHERE updated_at >= ? AND updated_at <= ?`,
        params
      );
      updatedRecordsInPeriod = result.count || 0;
    } catch (err) {
      console.error("Query para updatedRecordsInPeriod falló. Probablemente updated_at no existe. Msg:", err.message);
      updatedRecordsInPeriod = 'Error (campo updated_at?)';
    }

    return {
      summary: {
        newRecordsInPeriod,
        updatedRecordsInPeriod,
      }
    };
  }
}

module.exports = new MedicalHistoryModel();
