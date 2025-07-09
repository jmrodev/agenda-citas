const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { registerDoctorWithUser, registerSecretaryWithUser } = require('../controllers/authController');
const userConfigController = require('../controllers/userConfigController');

router.post('/register', authenticateToken, authorizeRoles('admin'), authController.register);

router.post('/register-doctor', authenticateToken, authorizeRoles('admin', 'secretary'), registerDoctorWithUser);
router.post('/register-secretary', authenticateToken, authorizeRoles('admin'), registerSecretaryWithUser);

router.post('/login', authController.login);

// Rutas para cambio de contraseña
router.post('/change-password', authenticateToken, authController.changePassword);
router.post('/users/:userId/change-password', authenticateToken, authorizeRoles('admin'), authController.changeUserPassword);

// Ruta temporal para obtener usuarios (solo para modal de secretaria)
router.get('/users', authenticateToken, authorizeRoles('admin'), authController.getUsers);

router.get('/user/config', authenticateToken, userConfigController.getConfig);
router.put('/user/config', authenticateToken, userConfigController.updateConfig);

module.exports = router; 