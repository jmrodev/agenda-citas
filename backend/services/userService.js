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

async function getUserById(userId) {
  return await userModel.findUserById(userId);
}

async function getUserByEntityId(entityId, role) {
  return await userModel.findUserByEntityId(entityId, role);
}

async function updateUserPassword(userId, hashedPassword) {
  return await userModel.updateUserPassword(userId, hashedPassword);
}

async function updateUsername(userId, username) {
  return await userModel.updateUsername(userId, username);
}

module.exports = {
  registerUser,
  getUserByEmail,
  getUserByUsername,
  getUserById,
  getUserByEntityId,
  updateUserPassword,
  updateUsername
}; 