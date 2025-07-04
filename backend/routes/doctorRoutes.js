const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', authenticateToken, doctorController.getAll);
router.post('/', authenticateToken, authorizeRoles('admin', 'secretary'), doctorController.create);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'secretary'), doctorController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'secretary'), doctorController.remove);
router.get('/dashboard-stats', authenticateToken, authorizeRoles('admin', 'secretary'), doctorController.getDashboardStats);
router.get('/:id', authenticateToken, doctorController.getById);

module.exports = router; 