const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', appointmentController.getAll);
router.get('/my', authenticateToken, authorizeRoles('patient'), appointmentController.getMyAppointments);

module.exports = router; 