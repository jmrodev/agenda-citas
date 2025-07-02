const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { registerDoctorWithUser, registerSecretaryWithUser } = require('../controllers/authController');

router.post('/register', authenticateToken, authorizeRoles('admin'), authController.register);
router.post('/login', authController.login);
router.post('/register-doctor', authenticateToken, authorizeRoles('admin'), registerDoctorWithUser);
router.post('/register-secretary', authenticateToken, authorizeRoles('admin'), registerSecretaryWithUser);

module.exports = router; 