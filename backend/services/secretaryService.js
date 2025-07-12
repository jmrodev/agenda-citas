const SecretaryModel = require('../models/entities/secretaryModel');
const UserModel = require('../models/entities/userModel');
const bcrypt = require('bcryptjs');

async function getAllSecretaries() {
  return await SecretaryModel.findAll();
}

async function createSecretary(data) {
  if (!data.first_name || !data.last_name || !data.email || !data.phone) {
    throw new Error('Los campos nombre, apellido, email y teléfono son requeridos');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error('Formato de email inválido');
  }

  const secretaryData = {
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone: data.phone,
    shift: data.shift || null,
    entry_time: data.entry_time || null,
    exit_time: data.exit_time || null
  };

  return await SecretaryModel.create(secretaryData);
}

async function getSecretaryById(id) {
  return await SecretaryModel.findById(id);
}

async function updateSecretary(id, data) {
  const existingSecretary = await SecretaryModel.findById(id);
  if (!existingSecretary) {
    throw new Error('Secretaria no encontrada');
  }

  if (!data.first_name || !data.last_name || !data.email || !data.phone) {
    throw new Error('Los campos nombre, apellido, email y teléfono son requeridos');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error('Formato de email inválido');
  }

  const updateData = {
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone: data.phone,
    shift: data.shift || null,
    entry_time: data.entry_time || null,
    exit_time: data.exit_time || null
  };

  await SecretaryModel.update(id, updateData);
  return await SecretaryModel.findById(id);
}

async function updateSecretaryWithPassword(id, data, passwordData = null, userData = null) {
  const existingSecretary = await SecretaryModel.findById(id);
  if (!existingSecretary) {
    throw new Error('Secretaria no encontrada');
  }

  if (!data.first_name || !data.last_name || !data.email || !data.phone) {
    throw new Error('Los campos nombre, apellido, email y teléfono son requeridos');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error('Formato de email inválido');
  }

  const updateData = {
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone: data.phone,
    shift: data.shift || null,
    entry_time: data.entry_time || null,
    exit_time: data.exit_time || null
  };

  const updatedSecretary = await SecretaryModel.update(id, updateData);

  if (passwordData && passwordData.newPassword) {
    const user = await UserModel.findUserByEntityId(id, 'secretary');
    if (user) {
      if (passwordData.currentPassword) {
        const validCurrentPassword = await bcrypt.compare(passwordData.currentPassword, user.password);
        if (!validCurrentPassword) {
          throw new Error('Contraseña actual incorrecta');
        }
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(passwordData.newPassword)) {
        throw new Error('La nueva contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número');
      }

      const hashedNewPassword = await bcrypt.hash(passwordData.newPassword, 10);
      await UserModel.updateUserPassword(user.user_id, hashedNewPassword);
    }
  }

  if (userData && userData.username) {
    const user = await UserModel.findUserByEntityId(id, 'secretary');
    if (user) {
      const existingUser = await UserModel.findUserByUsername(userData.username);
      if (existingUser && existingUser.user_id !== user.user_id) {
        throw new Error('El nombre de usuario ya está en uso');
      }

      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(userData.username)) {
        throw new Error('El nombre de usuario debe tener entre 3 y 20 caracteres, solo letras, números y guion bajo');
      }

      await UserModel.updateUsername(user.user_id, userData.username);
    }
  }

  return updatedSecretary;
}

async function deleteSecretary(id) {
  const existingSecretary = await SecretaryModel.findById(id);
  if (!existingSecretary) {
    throw new Error('Secretaria no encontrada');
  }

  return await SecretaryModel.delete(id);
}

async function getDashboardStats() {
  const total = await SecretaryModel.count();
  return { totalSecretarias: total };
}

module.exports = { 
  getAllSecretaries,
  createSecretary,
  getSecretaryById,
  updateSecretary,
  updateSecretaryWithPassword,
  deleteSecretary,
  getDashboardStats
};
