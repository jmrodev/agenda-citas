const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', authenticateToken, patientController.getAll);
router.post('/', authenticateToken, authorizeRoles('secretary', 'admin'), patientController.create);
router.put('/:id', authenticateToken, authorizeRoles('secretary', 'admin'), patientController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), patientController.remove);

module.exports = router; 