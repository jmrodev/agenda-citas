const secretaryModel = require('../models/secretaryModel');
const bcrypt = require('bcrypt');

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
  deleteSecretary,
  getDashboardStats
}; 