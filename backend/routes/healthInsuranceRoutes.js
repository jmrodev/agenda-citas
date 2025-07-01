const express = require('express');
const router = express.Router();
const healthInsuranceController = require('../controllers/healthInsuranceController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', authenticateToken, healthInsuranceController.getAll);
router.post('/', authenticateToken, authorizeRoles('admin'), healthInsuranceController.create);
router.put('/:id', authenticateToken, authorizeRoles('admin'), healthInsuranceController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), healthInsuranceController.remove);

module.exports = router; 