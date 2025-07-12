const pool = require('../../config/db');

/**
 * Modelo base que proporciona funcionalidades comunes para todos los modelos
 */
class BaseModel {
  constructor(tableName, primaryKey = 'id') {
    this.tableName = tableName;
    this.primaryKey = primaryKey;
  }

  /**
   * Obtener todos los registros de la tabla
   */
  async findAll() {
    const [rows] = await pool.query(`SELECT * FROM ${this.tableName}`);
    return rows;
  }

  /**
   * Obtener un registro por su ID
   */
  async findById(id) {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ?`,
      [id]
    );
    return rows[0] || null;
  }

  /**
   * Crear un nuevo registro
   */
  async create(data) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map(() => '?').join(', ');
    
    const sql = `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
    const [result] = await pool.query(sql, values);
    
    return { [this.primaryKey]: result.insertId, ...data };
  }

  /**
   * Actualizar un registro por ID
   */
  async update(id, data) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map(col => `${col} = ?`).join(', ');
    
    const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE ${this.primaryKey} = ?`;
    const [result] = await pool.query(sql, [...values, id]);
    
    return result.affectedRows > 0;
  }

  /**
   * Eliminar un registro por ID
   */
  async delete(id) {
    const [result] = await pool.query(
      `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Contar registros en la tabla
   */
  async count() {
    const [rows] = await pool.query(`SELECT COUNT(*) as total FROM ${this.tableName}`);
    return rows[0].total;
  }

  /**
   * Buscar registros con filtros básicos
   */
  async findWithFilters(filters = {}, pagination = {}) {
    let sql = `SELECT * FROM ${this.tableName}`;
    const params = [];
    
    // Aplicar filtros básicos
    if (Object.keys(filters).length > 0) {
      const whereConditions = [];
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null) {
          whereConditions.push(`${key} = ?`);
          params.push(value);
        }
      }
      
      if (whereConditions.length > 0) {
        sql += ` WHERE ${whereConditions.join(' AND ')}`;
      }
    }
    
    // Aplicar paginación básica
    if (pagination.limit) {
      sql += ` LIMIT ?`;
      params.push(pagination.limit);
      
      if (pagination.offset) {
        sql += ` OFFSET ?`;
        params.push(pagination.offset);
      }
    }
    
    const [rows] = await pool.query(sql, params);
    return rows;
  }

  /**
   * Verificar si existe un registro con un valor específico
   */
  async fieldExists(field, value, excludeId = null) {
    let sql = `SELECT COUNT(*) as count FROM ${this.tableName} WHERE ${field} = ?`;
    const params = [value];
    
    if (excludeId) {
      sql += ` AND ${this.primaryKey} != ?`;
      params.push(excludeId);
    }
    
    const [rows] = await pool.query(sql, params);
    return rows[0].count > 0;
  }

  /**
   * Buscar por un campo específico
   */
  async findByField(field, value) {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.tableName} WHERE ${field} = ?`,
      [value]
    );
    return rows[0] || null;
  }

  /**
   * Buscar múltiples registros por un campo específico
   */
  async findAllByField(field, value) {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.tableName} WHERE ${field} = ?`,
      [value]
    );
    return rows;
  }
}

module.exports = BaseModel; 