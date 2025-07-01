const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', authenticateToken, patientController.getAll);
router.get('/filtros', authenticateToken, patientController.getAllWithFilters);
router.post('/', authenticateToken, authorizeRoles('secretary', 'admin'), patientController.create);
router.put('/:id', authenticateToken, authorizeRoles('secretary', 'admin'), patientController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), patientController.remove);
router.post('/register', authenticateToken, authorizeRoles('admin', 'secretary', 'doctor'), patientController.registerPatientWithUser);
router.get('/me', authenticateToken, authorizeRoles('patient'), patientController.getMe);
router.put('/me', authenticateToken, authorizeRoles('patient'), patientController.updateMe);
router.get('/:id', authenticateToken, authorizeRoles('admin', 'secretary', 'doctor'), patientController.getById);

module.exports = router; 