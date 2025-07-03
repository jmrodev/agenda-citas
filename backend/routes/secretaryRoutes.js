const express = require('express');
const router = express.Router();
const secretaryController = require('../controllers/secretaryController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/dashboard-stats', authenticateToken, authorizeRoles('admin'), secretaryController.getDashboardStats);

module.exports = router; 