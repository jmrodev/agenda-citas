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
router.get('/dashboard-stats', authenticateToken, authorizeRoles('admin', 'secretary', 'doctor'), appointmentController.getDashboardStats);

// Endpoint para el reporte de citas
// Asegurarse que los roles aquí sean los correctos para acceder a reportes.
router.get('/reports/summary', authenticateToken, authorizeRoles('admin', 'secretary', 'doctor'), appointmentController.getAppointmentReportSummary);

router.post('/', authenticateToken, appointmentController.create);
// PUT y DELETE para citas podrían necesitar el ID en la ruta, ej /:id
// router.put('/:id', authenticateToken, appointmentController.update);
// router.delete('/:id', authenticateToken, authorizeRoles('admin'), appointmentController.remove);


module.exports = router; 