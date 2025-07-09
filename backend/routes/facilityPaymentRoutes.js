const express = require('express');
const router = express.Router();
const facilityPaymentController = require('../controllers/facilityPaymentController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Estadísticas para dashboard
router.get('/dashboard-stats', authenticateToken, authorizeRoles('admin', 'secretary'), facilityPaymentController.getDashboardStats);

// Estadísticas detalladas
router.get('/stats', authenticateToken, authorizeRoles('admin', 'secretary'), facilityPaymentController.getPaymentsStats);
router.get('/stats/by-doctor', authenticateToken, authorizeRoles('admin', 'secretary'), facilityPaymentController.getPaymentsByDoctorStats);

// Listado de pagos
router.get('/', authenticateToken, authorizeRoles('admin', 'secretary'), facilityPaymentController.getAllPayments);
router.get('/by-date-range', authenticateToken, authorizeRoles('admin', 'secretary'), facilityPaymentController.getPaymentsByDateRange);

const { validateBody } = require('../filters/validateQuery');
const { updateFacilityPaymentSchema } = require('../validations');

// Actualizar pago de doctor
router.put(
    '/:doctor_id/payments/:payment_id',
    authenticateToken,
    authorizeRoles('admin', 'secretary'),
    validateBody(updateFacilityPaymentSchema), // Suponiendo que este schema es adecuado
    facilityPaymentController.updatePayment
);
// Eliminar pago de doctor
router.delete('/:doctor_id/payments/:payment_id', authenticateToken, authorizeRoles('admin', 'secretary'), facilityPaymentController.removePayment);


// Endpoint para el reporte de pagos
// Roles: admin y secretary deberían tener acceso a este tipo de reportes financieros. Doctores podrían tener acceso a *sus* pagos, pero este es un summary general.
router.get('/reports/summary', authenticateToken, authorizeRoles('admin', 'secretary'), facilityPaymentController.getPaymentReportSummary);


module.exports = router; 