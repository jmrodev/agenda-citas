const express = require('express');
const router = express.Router();
const medicalHistoryController = require('../controllers/medicalHistoryController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const validateQuery = require('../filters/validateQuery');
const medicalHistoryFiltersSchema = require('../filters/joi/medicalHistoryFiltersSchema');

router.get('/', authenticateToken, medicalHistoryController.getAll);
router.get('/filtros', authenticateToken, validateQuery(medicalHistoryFiltersSchema), medicalHistoryController.getAllWithFilters);
router.post('/', authenticateToken, authorizeRoles('doctor', 'admin'), medicalHistoryController.create);
router.put('/:id', authenticateToken, authorizeRoles('doctor', 'admin'), medicalHistoryController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), medicalHistoryController.remove);
router.get('/my', authenticateToken, authorizeRoles('patient'), medicalHistoryController.getMyMedicalHistory);
router.put('/:record_id/prescribed-meds/:med_id', authenticateToken, authorizeRoles('doctor', 'admin'), medicalHistoryController.updatePrescribedMed);
router.delete('/:record_id/prescribed-meds/:med_id', authenticateToken, authorizeRoles('doctor', 'admin'), medicalHistoryController.removePrescribedMed);
router.get('/:record_id/prescribed-meds', authenticateToken, authorizeRoles('admin', 'doctor', 'secretary'), medicalHistoryController.getPrescribedMeds);
router.post('/:record_id/prescribed-meds', authenticateToken, authorizeRoles('doctor', 'secretary'), medicalHistoryController.createPrescribedMed);

module.exports = router; 