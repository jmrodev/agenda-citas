const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validateQuery, validateBody } = require('../filters/validateQuery'); // Importar validateBody
const {
    appointmentFiltersSchema,
    createAppointmentSchema,
    updateAppointmentSchema
} = require('../validations');

router.get('/', authenticateToken, appointmentController.getAll);
router.get('/filtros', authenticateToken, validateQuery(appointmentFiltersSchema), appointmentController.getAllWithFilters);
router.get('/my', authenticateToken, authorizeRoles('patient'), appointmentController.getMyAppointments);
router.get('/dashboard-stats', authenticateToken, authorizeRoles('admin', 'secretary', 'doctor'), appointmentController.getDashboardStats);

// Endpoint para el reporte de citas
router.get('/reports/summary', authenticateToken, authorizeRoles('admin', 'secretary', 'doctor'), appointmentController.getAppointmentReportSummary);

router.post(
    '/',
    authenticateToken,
    validateBody(createAppointmentSchema),
    appointmentController.create
);
router.put(
    '/:id',
    authenticateToken,
    validateBody(updateAppointmentSchema),
    appointmentController.update
);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), appointmentController.remove);

// Nuevas rutas para manejo de citas por doctor y confirmación/rechazo
// Estas rutas no suelen llevar un body complejo que necesite validación Joi, o son acciones simples.
router.get('/doctor/:doctorId', authenticateToken, appointmentController.getAppointmentsByDoctor);
router.put('/:id/confirm', authenticateToken, authorizeRoles('doctor', 'admin'), appointmentController.confirmOutOfScheduleAppointment);
router.put('/:id/reject', authenticateToken, authorizeRoles('doctor', 'admin'), appointmentController.rejectOutOfScheduleAppointment);


module.exports = router; 