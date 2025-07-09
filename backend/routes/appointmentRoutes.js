const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const validateQuery = require('../filters/validateQuery');
const { appointmentFiltersSchema } = require('../validations'); // Modificado

router.get('/', authenticateToken, appointmentController.getAll);
router.get('/filtros', authenticateToken, validateQuery(appointmentFiltersSchema), appointmentController.getAllWithFilters);
router.get('/my', authenticateToken, authorizeRoles('patient'), appointmentController.getMyAppointments);
router.get('/dashboard-stats', authenticateToken, authorizeRoles('admin', 'secretary', 'doctor'), appointmentController.getDashboardStats);

// Endpoint para el reporte de citas
// Asegurarse que los roles aquí sean los correctos para acceder a reportes.
router.get('/reports/summary', authenticateToken, authorizeRoles('admin', 'secretary', 'doctor'), appointmentController.getAppointmentReportSummary);

router.post('/', authenticateToken, appointmentController.create);
router.put('/:id', authenticateToken, appointmentController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), appointmentController.remove);

// Nuevas rutas para manejo de citas por doctor y confirmación/rechazo
router.get('/doctor/:doctorId', authenticateToken, appointmentController.getAppointmentsByDoctor);
router.put('/:id/confirm', authenticateToken, authorizeRoles('doctor', 'admin'), appointmentController.confirmOutOfScheduleAppointment);
router.put('/:id/reject', authenticateToken, authorizeRoles('doctor', 'admin'), appointmentController.rejectOutOfScheduleAppointment);


module.exports = router; 