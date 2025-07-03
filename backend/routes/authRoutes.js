const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { registerDoctorWithUser, registerSecretaryWithUser } = require('../controllers/authController');
const userConfigController = require('../controllers/userConfigController');

router.post('/register', authenticateToken, authorizeRoles('admin'), authController.register);
router.post('/login', authController.login);
router.post('/register-doctor', authenticateToken, authorizeRoles('admin'), registerDoctorWithUser);
router.post('/register-secretary', authenticateToken, authorizeRoles('admin'), registerSecretaryWithUser);
router.get('/user/config', authenticateToken, userConfigController.getConfig);
router.put('/user/config', authenticateToken, userConfigController.updateConfig);

module.exports = router; 