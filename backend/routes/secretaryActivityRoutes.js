const express = require('express');
const router = express.Router();
const secretaryActivityController = require('../controllers/secretaryActivityController');
const authMiddleware = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validateQuery, validateBody } = require('../filters/validateQuery'); // Importar validateBody
const {
    secretaryActivityFiltersSchema,
    createSecretaryActivitySchema
} = require('../validations');

// GET /api/secretary-activities
// Filtros disponibles por query: secretary_id, date, date_from, date_to, activity_type, activity_types, activity_id, detail, time_from, time_to
router.get('/', authMiddleware.authenticateToken, authorizeRoles('admin', 'secretary'), validateQuery(secretaryActivityFiltersSchema), secretaryActivityController.getAll);

// POST /api/secretary-activities
router.post(
    '/',
    authMiddleware.authenticateToken,
    authorizeRoles('admin', 'secretary'),
    validateBody(createSecretaryActivitySchema),
    secretaryActivityController.create
);

// Endpoint para el reporte de actividad de secretarias
router.get('/reports/summary', authMiddleware.authenticateToken, authorizeRoles('admin', 'secretary'), secretaryActivityController.getSecretaryActivityReportSummary);

module.exports = router; 