const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', authenticateToken, doctorController.getAll);
router.post('/', authenticateToken, authorizeRoles('admin'), doctorController.create);
router.put('/:id', authenticateToken, authorizeRoles('admin'), doctorController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), doctorController.remove);
router.get('/dashboard-stats', authenticateToken, authorizeRoles('admin'), doctorController.getDashboardStats);

module.exports = router; 