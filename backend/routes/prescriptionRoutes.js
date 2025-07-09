const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validateQuery, validateBody } = require('../filters/validateQuery');
const {
    prescriptionFiltersSchema,
    createPrescriptionSchema,
    updatePrescriptionSchema,
    updateMedicationInPrescriptionSchema
} = require('../validations');

router.get('/', authenticateToken, prescriptionController.getAll);
router.get('/filtros', authenticateToken, validateQuery(prescriptionFiltersSchema), prescriptionController.getAllWithFilters);
router.post(
    '/',
    authenticateToken,
    authorizeRoles('doctor', 'admin'),
    validateBody(createPrescriptionSchema),
    prescriptionController.create
);
router.put(
    '/:id',
    authenticateToken,
    authorizeRoles('doctor', 'admin'),
    validateBody(updatePrescriptionSchema),
    prescriptionController.update
);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), prescriptionController.remove);
router.get('/my', authenticateToken, authorizeRoles('patient'), prescriptionController.getMyPrescriptions);

router.put(
    '/:prescription_id/medications/:med_id',
    authenticateToken,
    authorizeRoles('doctor', 'admin'),
    validateBody(updateMedicationInPrescriptionSchema),
    prescriptionController.updateMedication
);
router.delete('/:prescription_id/medications/:med_id', authenticateToken, authorizeRoles('doctor', 'admin'), prescriptionController.removeMedication);
// Nota: Falta una ruta POST para '/:prescription_id/medications' si se quiere añadir medicamentos a una prescripción existente.
// El schema 'medicationItemSchema' (exportado como createPrescriptionMedicationSchema si se desea) podría usarse para ello.

module.exports = router; 