const express = require('express');
const router = express.Router();
const doctorConsultationHourController = require('../controllers/doctorConsultationHourController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validateBody } = require('../filters/validateQuery');
const {
    createConsultationHourSchema,
    updateConsultationHourSchema,
    // bulkConsultationHoursSchema // Si se implementa una ruta para ello
} = require('../validations');

router.get('/', authenticateToken, doctorConsultationHourController.getAll);
router.post(
    '/',
    authenticateToken,
    authorizeRoles('doctor', 'admin'),
    validateBody(createConsultationHourSchema),
    doctorConsultationHourController.create
);
router.put(
    '/:id',
    authenticateToken,
    authorizeRoles('doctor', 'admin'),
    validateBody(updateConsultationHourSchema),
    doctorConsultationHourController.update
);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), doctorConsultationHourController.remove);

// Ejemplo de ruta para bulk (si se decide implementar así en el controlador)
// router.post(
//     '/bulk',
//     authenticateToken,
//     authorizeRoles('admin'), // o 'doctor'
//     validateBody(bulkConsultationHoursSchema),
//     doctorConsultationHourController.bulkCreateOrUpdate // Suponiendo que existe tal función
// );

module.exports = router; 