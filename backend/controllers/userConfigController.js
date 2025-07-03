const userConfigService = require('../services/userConfigService');

exports.getConfig = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const config = await userConfigService.getConfigByUserId(userId);
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener la configuración' });
  }
};

exports.updateConfig = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { session_timeout_minutes } = req.body;
    await userConfigService.updateConfigByUserId(userId, { session_timeout_minutes });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar la configuración' });
  }
}; 