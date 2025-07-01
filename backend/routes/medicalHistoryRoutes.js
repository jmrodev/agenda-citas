const express = require('express');
const router = express.Router();
const medicalHistoryController = require('../controllers/medicalHistoryController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', authenticateToken, medicalHistoryController.getAll);
router.post('/', authenticateToken, authorizeRoles('doctor', 'admin'), medicalHistoryController.create);
router.put('/:id', authenticateToken, authorizeRoles('doctor', 'admin'), medicalHistoryController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), medicalHistoryController.remove);

module.exports = router; 