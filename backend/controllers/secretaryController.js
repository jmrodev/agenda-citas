const secretaryService = require('../services/secretaryService');

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
    const secretaryData = req.body;
    const newSecretary = await secretaryService.createSecretary(secretaryData);
    res.status(201).json({ secretary: newSecretary });
  } catch (err) {
    console.error('Error al crear secretaria:', err);
    if (err.message.includes('duplicate')) {
      res.status(409).json({ error: { message: 'Ya existe una secretaria con ese email o nombre de usuario' } });
    } else {
      res.status(500).json({ error: { message: 'Error al crear la secretaria' } });
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
    const { id } = req.params;
    const updateData = req.body;
    const updatedSecretary = await secretaryService.updateSecretary(id, updateData);
    
    if (!updatedSecretary) {
      return res.status(404).json({ error: { message: 'Secretaria no encontrada' } });
    }
    
    res.json({ secretary: updatedSecretary });
  } catch (err) {
    console.error('Error al actualizar secretaria:', err);
    if (err.message.includes('duplicate')) {
      res.status(409).json({ error: { message: 'Ya existe una secretaria con ese email o nombre de usuario' } });
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
  deleteSecretary,
  getDashboardStats
}; 