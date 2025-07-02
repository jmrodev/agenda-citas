const secretaryModel = require('../models/secretaryModel');

async function createSecretary(data) {
  return await secretaryModel.createSecretary(data);
}

module.exports = { createSecretary }; 