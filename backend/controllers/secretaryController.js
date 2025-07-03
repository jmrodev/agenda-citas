const secretaryService = require('../services/secretaryService');

async function getDashboardStats(req, res) {
  try {
    const stats = await secretaryService.getDashboardStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener estadísticas de secretarias' });
  }
}

module.exports = { getDashboardStats }; 