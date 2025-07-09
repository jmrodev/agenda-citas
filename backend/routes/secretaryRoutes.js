const express = require('express');
const router = express.Router();
const secretaryController = require('../controllers/secretaryController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Rutas CRUD para secretarias
router.get('/', authenticateToken, authorizeRoles('admin'), secretaryController.getAllSecretaries);
router.post('/', authenticateToken, authorizeRoles('admin'), secretaryController.createSecretary);
router.get('/:id', authenticateToken, authorizeRoles('admin'), secretaryController.getSecretaryById);
router.put('/:id', authenticateToken, authorizeRoles('admin'), secretaryController.updateSecretary);
router.put('/:id/with-password', authenticateToken, authorizeRoles('admin', 'secretary'), secretaryController.updateSecretaryWithPassword);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), secretaryController.deleteSecretary);

// Ruta para estadísticas del dashboard
router.get('/dashboard-stats', authenticateToken, authorizeRoles('admin'), secretaryController.getDashboardStats);

module.exports = router; 