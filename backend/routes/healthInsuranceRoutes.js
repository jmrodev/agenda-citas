const express = require('express');
const router = express.Router();
const healthInsuranceController = require('../controllers/healthInsuranceController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const validateQuery = require('../filters/validateQuery');
const healthInsuranceFiltersSchema = require('../filters/joi/healthInsuranceFiltersSchema');

router.get('/', authenticateToken, healthInsuranceController.getAll);
router.get('/filtros', authenticateToken, validateQuery(healthInsuranceFiltersSchema), healthInsuranceController.getAllWithFilters);
router.post('/', authenticateToken, authorizeRoles('admin'), healthInsuranceController.create);
router.put('/:id', authenticateToken, authorizeRoles('admin'), healthInsuranceController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), healthInsuranceController.remove);

module.exports = router; 