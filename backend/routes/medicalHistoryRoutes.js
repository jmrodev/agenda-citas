const express = require('express');
const router = express.Router();
const medicalHistoryController = require('../controllers/medicalHistoryController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validateQuery, validateBody } = require('../filters/validateQuery'); // Importar validateBody
const {
    medicalHistoryFiltersSchema,
    createMedicalHistorySchema,
    updateMedicalHistorySchema,
    createPrescribedMedicationSchema,
    updatePrescribedMedicationSchema
} = require('../validations');

router.get('/', authenticateToken, medicalHistoryController.getAll);
router.get('/filtros', authenticateToken, validateQuery(medicalHistoryFiltersSchema), medicalHistoryController.getAllWithFilters);
router.post(
    '/',
    authenticateToken,
    authorizeRoles('doctor', 'admin'),
    validateBody(createMedicalHistorySchema),
    medicalHistoryController.create
);
router.put(
    '/:id',
    authenticateToken,
    authorizeRoles('doctor', 'admin'),
    validateBody(updateMedicalHistorySchema),
    medicalHistoryController.update
);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), medicalHistoryController.remove);
router.get('/my', authenticateToken, authorizeRoles('patient'), medicalHistoryController.getMyMedicalHistory);

router.put(
    '/:record_id/prescribed-meds/:med_id',
    authenticateToken,
    authorizeRoles('doctor', 'admin'),
    validateBody(updatePrescribedMedicationSchema),
    medicalHistoryController.updatePrescribedMed
);
router.delete('/:record_id/prescribed-meds/:med_id', authenticateToken, authorizeRoles('doctor', 'admin'), medicalHistoryController.removePrescribedMed);
router.get('/:record_id/prescribed-meds', authenticateToken, authorizeRoles('admin', 'doctor', 'secretary'), medicalHistoryController.getPrescribedMeds);
router.post(
    '/:record_id/prescribed-meds',
    authenticateToken,
    authorizeRoles('doctor', 'secretary'),
    validateBody(createPrescribedMedicationSchema),
    medicalHistoryController.createPrescribedMed
);

// Endpoint para el reporte de historias clínicas
router.get('/reports/summary', authenticateToken, authorizeRoles('admin', 'doctor', 'secretary'), medicalHistoryController.getMedicalHistoryReportSummary);

module.exports = router; 