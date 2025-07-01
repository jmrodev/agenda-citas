const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', authenticateToken, prescriptionController.getAll);
router.get('/filtros', authenticateToken, prescriptionController.getAllWithFilters);
router.post('/', authenticateToken, authorizeRoles('doctor', 'admin'), prescriptionController.create);
router.put('/:id', authenticateToken, authorizeRoles('doctor', 'admin'), prescriptionController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), prescriptionController.remove);
router.get('/my', authenticateToken, authorizeRoles('patient'), prescriptionController.getMyPrescriptions);
router.put('/:prescription_id/medications/:med_id', authenticateToken, authorizeRoles('doctor', 'admin'), prescriptionController.updateMedication);
router.delete('/:prescription_id/medications/:med_id', authenticateToken, authorizeRoles('doctor', 'admin'), prescriptionController.removeMedication);

module.exports = router; 