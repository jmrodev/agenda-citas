const userModel = require('../models/userModel');

async function registerUser({ email, password, role, entity_id }) {
  return await userModel.createUser({ email, password, role, entity_id });
}

async function getUserByEmail(email) {
  return await userModel.findUserByEmail(email);
}

module.exports = { registerUser, getUserByEmail }; 