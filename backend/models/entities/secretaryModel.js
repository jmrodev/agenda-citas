const BaseModel = require('../base/BaseModel');

class SecretaryModel extends BaseModel {
  constructor() {
    super('secretaries', 'secretary_id');
  }
}

module.exports = new SecretaryModel();
