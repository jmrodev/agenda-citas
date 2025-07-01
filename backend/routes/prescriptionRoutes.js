const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', authenticateToken, prescriptionController.getAll);
router.post('/', authenticateToken, authorizeRoles('doctor', 'admin'), prescriptionController.create);
router.put('/:id', authenticateToken, authorizeRoles('doctor', 'admin'), prescriptionController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), prescriptionController.remove);

module.exports = router; 