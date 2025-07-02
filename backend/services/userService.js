const userModel = require('../models/userModel');

async function registerUser({ username, email, password, role, entity_id }) {
  return await userModel.createUser({ username, email, password, role, entity_id });
}

async function getUserByEmail(email) {
  return await userModel.findUserByEmail(email);
}

async function getUserByUsername(username) {
  return await userModel.findUserByUsername(username);
}

module.exports = { registerUser, getUserByEmail, getUserByUsername }; 