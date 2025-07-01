const express = require('express');
const router = express.Router();
const secretaryActivityController = require('../controllers/secretaryActivityController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', authenticateToken, secretaryActivityController.getAll);
router.post('/', authenticateToken, authorizeRoles('secretary', 'admin'), secretaryActivityController.create);
router.put('/:id', authenticateToken, authorizeRoles('secretary', 'admin'), secretaryActivityController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), secretaryActivityController.remove);

module.exports = router; 