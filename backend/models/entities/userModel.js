const BaseModel = require('../base/BaseModel');
const pool = require('../../config/db');

class UserModel extends BaseModel {
  constructor() {
    super('users', 'user_id');
  }

  async findUserByEmail(email) {
    return this.findByField('email', email);
  }

  async findUserByUsername(username) {
    return this.findByField('username', username);
  }

  async findUserByEntityId(entityId, role) {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.tableName} WHERE entity_id = ? AND role = ?`,
      [entityId, role]
    );
    return rows[0];
  }

  async updateUserPassword(userId, hashedPassword) {
    const result = await this.update(userId, { password: hashedPassword });
    return result;
  }

  async updateUsername(userId, username) {
    const result = await this.update(userId, { username: username });
    return result;
  }
}

module.exports = new UserModel();
