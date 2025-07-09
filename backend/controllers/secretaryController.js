const secretaryService = require('../services/secretaryService');
const userService = require('../services/userService');
const bcrypt = require('bcryptjs');

// Obtener todas las secretarias
async function getAllSecretaries(req, res) {
  try {
    const secretaries = await secretaryService.getAllSecretaries();
    res.json({ secretaries });
  } catch (err) {
    console.error('Error al obtener secretarias:', err);
    res.status(500).json({ error: { message: 'Error al obtener las secretarias' } });
  }
}

// Crear una nueva secretaria
async function createSecretary(req, res) {
  try {
    // req.body ya está validado por Joi gracias al middleware validateBody
    const secretaryData = req.body;
    const newSecretary = await secretaryService.createSecretary(secretaryData);
    res.status(201).json({ secretary: newSecretary });
  } catch (err) {
    console.error('Error al crear secretaria:', err);
    // Los errores de validación de formato/requerido son manejados por Joi (HTTP 400)
    // Aquí se manejan errores específicos del servicio (ej. duplicados) u otros errores 500
    if (err.message.includes('duplicate') || err.message.includes('Ya existe')) {
      res.status(409).json({ error: { message: err.message } });
    } else {
      // Errores de validación que pudieron pasar Joi pero fallaron en el servicio
      // o errores genéricos del servidor.
      res.status(err.statusCode || 500).json({ error: { message: err.message || 'Error al crear la secretaria' } });
    }
  }
}

// Obtener una secretaria por ID
async function getSecretaryById(req, res) {
  try {
    const { id } = req.params;
    const secretary = await secretaryService.getSecretaryById(id);
    
    if (!secretary) {
      return res.status(404).json({ error: { message: 'Secretaria no encontrada' } });
    }
    
    res.json({ secretary });
  } catch (err) {
    console.error('Error al obtener secretaria:', err);
    res.status(500).json({ error: { message: 'Error al obtener la secretaria' } });
  }
}

// Actualizar una secretaria
async function updateSecretary(req, res) {
  try {
    // req.body ya está validado por Joi gracias al middleware validateBody
    const { id } = req.params;
    const updateData = req.body;
    const updatedSecretary = await secretaryService.updateSecretary(id, updateData);
    
    if (!updatedSecretary) {
      return res.status(404).json({ error: { message: 'Secretaria no encontrada para actualizar.' } });
    }
    
    res.json({ secretary: updatedSecretary });
  } catch (err) {
    console.error('Error al actualizar secretaria:', err);
    // Los errores de validación de formato/requerido son manejados por Joi (HTTP 400)
    // Aquí se manejan errores específicos del servicio (ej. duplicados, no encontrado) u otros errores 500
    if (err.message.includes('duplicate') || err.message.includes('Ya existe')) {
      res.status(409).json({ error: { message: err.message } });
    } else if (err.message.includes('not found') || err.statusCode === 404) {
      res.status(404).json({ error: { message: 'Secretaria no encontrada.' } });
    } else {
      res.status(err.statusCode || 500).json({ error: { message: err.message || 'Error al actualizar la secretaria' } });
    }
  }
}

// Actualizar una secretaria con cambio de contraseña y username opcional
async function updateSecretaryWithPassword(req, res) {
  try {
    const { id } = req.params;
    const { secretaryData, passwordData, userData } = req.body;
    const currentUser = req.user;

    // Verificar permisos
    if (currentUser.role === 'admin') {
      // Admin puede editar cualquier secretaria
      // Si se proporciona contraseña, debe incluir contraseña de admin
      if (passwordData && passwordData.newPassword && !passwordData.adminPassword) {
        return res.status(400).json({ error: { message: 'Se requiere contraseña de administrador para cambiar la contraseña' } });
      }

      // Validar contraseña de admin si se proporciona
      if (passwordData && passwordData.adminPassword) {
        const adminUser = await userService.getUserById(currentUser.user_id);
        const validAdminPassword = await bcrypt.compare(passwordData.adminPassword, adminUser.password);
        if (!validAdminPassword) {
          return res.status(401).json({ error: { message: 'Contraseña de administrador incorrecta' } });
        }
      }
    } else if (currentUser.role === 'secretary') {
      // Secretaria solo puede editar su propio perfil
      const user = await userService.getUserByEntityId(id, 'secretary');
      if (!user || user.user_id !== currentUser.user_id) {
        return res.status(403).json({ error: { message: 'Solo puedes editar tu propio perfil' } });
      }

      // Para cambiar contraseña, debe proporcionar contraseña actual
      if (passwordData && passwordData.newPassword && !passwordData.currentPassword) {
        return res.status(400).json({ error: { message: 'Se requiere contraseña actual para cambiar la contraseña' } });
      }

      // Secretaria no puede cambiar su username
      if (userData && userData.username) {
        return res.status(403).json({ error: { message: 'No puedes cambiar tu nombre de usuario' } });
      }
    } else {
      return res.status(403).json({ error: { message: 'No tienes permisos para editar secretarias' } });
    }

    const updatedSecretary = await secretaryService.updateSecretaryWithPassword(id, secretaryData, passwordData, userData);
    
    if (!updatedSecretary) {
      return res.status(404).json({ error: { message: 'Secretaria no encontrada' } });
    }
    
    res.json({ secretary: updatedSecretary });
  } catch (err) {
    console.error('Error al actualizar secretaria con contraseña:', err);
    if (err.message.includes('Contraseña actual incorrecta')) {
      res.status(401).json({ error: { message: err.message } });
    } else if (err.message.includes('duplicate') || err.message.includes('ya está en uso')) {
      res.status(409).json({ error: { message: err.message } });
    } else {
      res.status(500).json({ error: { message: 'Error al actualizar la secretaria' } });
    }
  }
}

// Eliminar una secretaria
async function deleteSecretary(req, res) {
  try {
    const { id } = req.params;
    const deleted = await secretaryService.deleteSecretary(id);
    
    if (!deleted) {
      return res.status(404).json({ error: { message: 'Secretaria no encontrada' } });
    }
    
    res.json({ message: 'Secretaria eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar secretaria:', err);
    res.status(500).json({ error: { message: 'Error al eliminar la secretaria' } });
  }
}

// Obtener estadísticas del dashboard
async function getDashboardStats(req, res) {
  try {
    const stats = await secretaryService.getDashboardStats();
    res.json(stats);
  } catch (err) {
    console.error('Error al obtener estadísticas:', err);
    res.status(500).json({ error: { message: 'Error al obtener estadísticas de secretarias' } });
  }
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