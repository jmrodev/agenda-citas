const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', authenticateToken, appointmentController.getAll);
router.get('/filtros', authenticateToken, appointmentController.getAllWithFilters);
router.get('/my', authenticateToken, authorizeRoles('patient'), appointmentController.getMyAppointments);

module.exports = router; 