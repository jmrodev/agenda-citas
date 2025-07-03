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

// Actualizar pago de doctor
router.put('/:doctor_id/payments/:payment_id', authenticateToken, authorizeRoles('admin', 'secretary'), facilityPaymentController.updatePayment);
// Eliminar pago de doctor
router.delete('/:doctor_id/payments/:payment_id', authenticateToken, authorizeRoles('admin', 'secretary'), facilityPaymentController.removePayment);

module.exports = router; 