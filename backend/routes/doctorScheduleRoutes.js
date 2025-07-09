const express = require('express');
const router = express.Router();
const doctorScheduleController = require('../controllers/doctorScheduleController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

/**
 * @route GET /api/doctors/schedule
 * @desc Obtiene los horarios de consulta de todos los doctores para un día específico
 * @access Private
 */
router.get('/schedule', doctorScheduleController.getAllDoctorsSchedule);

/**
 * @route GET /api/doctors/:doctorId/schedule
 * @desc Obtiene los horarios de consulta de un doctor para un día específico
 * @access Private
 */
router.get('/:doctorId/schedule', doctorScheduleController.getDoctorSchedule);

module.exports = router; 