const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const validateQuery = require('../filters/validateQuery');
const appointmentFiltersSchema = require('../filters/joi/appointmentFiltersSchema');

router.get('/', authenticateToken, appointmentController.getAll);
router.get('/filtros', authenticateToken, validateQuery(appointmentFiltersSchema), appointmentController.getAllWithFilters);
router.get('/my', authenticateToken, authorizeRoles('patient'), appointmentController.getMyAppointments);

module.exports = router; 