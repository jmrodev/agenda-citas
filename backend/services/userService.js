const UserModel = require('../models/entities/userModel');

async function registerUser({ username, email, password, role, entity_id }) {
  return await UserModel.create({ username, email, password, role, entity_id });
}

async function getUserByEmail(email) {
  return await UserModel.findUserByEmail(email);
}

async function getUserByUsername(username) {
  return await UserModel.findUserByUsername(username);
}

async function getUserById(userId) {
  return await UserModel.findById(userId);
}

async function getUserByEntityId(entityId, role) {
  return await UserModel.findUserByEntityId(entityId, role);
}

async function updateUserPassword(userId, hashedPassword) {
  return await UserModel.updateUserPassword(userId, hashedPassword);
}

async function updateUsername(userId, username) {
  return await UserModel.updateUsername(userId, username);
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
