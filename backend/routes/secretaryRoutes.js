const express = require('express');
const router = express.Router();
const secretaryController = require('../controllers/secretaryController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validateBody } = require('../filters/validateQuery'); // Importar validateBody
const {
    createSecretarySchema,
    updateSecretarySchema,
    updateSecretaryWithDetailsSchema
} = require('../validations'); // Importar esquemas de secretaria

// Rutas CRUD para secretarias
router.get('/', authenticateToken, authorizeRoles('admin'), secretaryController.getAllSecretaries);
router.post(
    '/',
    authenticateToken,
    authorizeRoles('admin'),
    validateBody(createSecretarySchema), // Aplicar validación
    secretaryController.createSecretary
);
router.get('/:id', authenticateToken, authorizeRoles('admin'), secretaryController.getSecretaryById);
router.put(
    '/:id',
    authenticateToken,
    authorizeRoles('admin'),
    validateBody(updateSecretarySchema), // Aplicar validación
    secretaryController.updateSecretary
);
router.put(
    '/:id/with-password',
    authenticateToken,
    authorizeRoles('admin', 'secretary'),
    validateBody(updateSecretaryWithDetailsSchema, {
        abortEarly: false,
        allowUnknown: true, // Permitir campos adicionales en req.body que no estén en el schema (Joi los ignorará si stripUnknown es true)
        stripUnknown: false // Mantener campos desconocidos, el controlador podría necesitarlos o Joi los limpiará si es true
    }),
    secretaryController.updateSecretaryWithPassword
);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), secretaryController.deleteSecretary);

// Ruta para estadísticas del dashboard
router.get('/dashboard-stats', authenticateToken, authorizeRoles('admin'), secretaryController.getDashboardStats);

module.exports = router; 