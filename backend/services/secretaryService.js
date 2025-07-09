const secretaryModel = require('../models/secretaryModel');
const userService = require('./userService');
const bcrypt = require('bcryptjs');

// Obtener todas las secretarias
async function getAllSecretaries() {
  return await secretaryModel.getAllSecretaries();
}

// Crear una nueva secretaria
async function createSecretary(data) {
  // Validar datos requeridos
  if (!data.first_name || !data.last_name || !data.email || !data.phone) {
    throw new Error('Los campos nombre, apellido, email y teléfono son requeridos');
  }

  // Validar formato de email
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

  return await secretaryModel.createSecretary(secretaryData);
}

// Obtener una secretaria por ID
async function getSecretaryById(id) {
  return await secretaryModel.getSecretaryById(id);
}

// Actualizar una secretaria
async function updateSecretary(id, data) {
  // Validar que la secretaria existe
  const existingSecretary = await secretaryModel.getSecretaryById(id);
  if (!existingSecretary) {
    throw new Error('Secretaria no encontrada');
  }

  // Validar datos requeridos
  if (!data.first_name || !data.last_name || !data.email || !data.phone) {
    throw new Error('Los campos nombre, apellido, email y teléfono son requeridos');
  }

  // Validar formato de email
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

  return await secretaryModel.updateSecretary(id, updateData);
}

// Actualizar una secretaria con cambio de contraseña y username opcional
async function updateSecretaryWithPassword(id, data, passwordData = null, userData = null) {
  // Validar que la secretaria existe
  const existingSecretary = await secretaryModel.getSecretaryById(id);
  if (!existingSecretary) {
    throw new Error('Secretaria no encontrada');
  }

  // Validar datos requeridos
  if (!data.first_name || !data.last_name || !data.email || !data.phone) {
    throw new Error('Los campos nombre, apellido, email y teléfono son requeridos');
  }

  // Validar formato de email
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

  // Actualizar datos de secretaria
  const updatedSecretary = await secretaryModel.updateSecretary(id, updateData);

  // Si se proporciona nueva contraseña, actualizar también el usuario
  if (passwordData && passwordData.newPassword) {
    // Buscar el usuario asociado a esta secretaria
    const user = await userService.getUserByEntityId(id, 'secretary');
    if (user) {
      // Validar contraseña si se proporciona contraseña actual
      if (passwordData.currentPassword) {
        const validCurrentPassword = await bcrypt.compare(passwordData.currentPassword, user.password);
        if (!validCurrentPassword) {
          throw new Error('Contraseña actual incorrecta');
        }
      }

      // Validar nueva contraseña
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(passwordData.newPassword)) {
        throw new Error('La nueva contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número');
      }

      // Hashear y actualizar contraseña
      const hashedNewPassword = await bcrypt.hash(passwordData.newPassword, 10);
      await userService.updateUserPassword(user.user_id, hashedNewPassword);
    }
  }

  // Si se proporciona nuevo username, actualizar el usuario
  if (userData && userData.username) {
    // Buscar el usuario asociado a esta secretaria
    const user = await userService.getUserByEntityId(id, 'secretary');
    if (user) {
      // Validar que el nuevo username no esté en uso
      const existingUser = await userService.getUserByUsername(userData.username);
      if (existingUser && existingUser.user_id !== user.user_id) {
        throw new Error('El nombre de usuario ya está en uso');
      }

      // Validar formato del username
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(userData.username)) {
        throw new Error('El nombre de usuario debe tener entre 3 y 20 caracteres, solo letras, números y guion bajo');
      }

      // Actualizar username
      await userService.updateUsername(user.user_id, userData.username);
    }
  }

  return updatedSecretary;
}

// Eliminar una secretaria
async function deleteSecretary(id) {
  // Validar que la secretaria existe
  const existingSecretary = await secretaryModel.getSecretaryById(id);
  if (!existingSecretary) {
    throw new Error('Secretaria no encontrada');
  }

  return await secretaryModel.deleteSecretary(id);
}

// Obtener estadísticas del dashboard
async function getDashboardStats() {
  const rows = await secretaryModel.getAllSecretaries();
  return { totalSecretarias: rows.length };
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