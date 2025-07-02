const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.post('/register', authenticateToken, authorizeRoles('admin'), authController.register);
router.post('/login', authController.login);

module.exports = router; 