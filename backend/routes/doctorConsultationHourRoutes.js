const express = require('express');
const router = express.Router();
const doctorConsultationHourController = require('../controllers/doctorConsultationHourController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', authenticateToken, doctorConsultationHourController.getAll);
router.post('/', authenticateToken, authorizeRoles('doctor', 'admin'), doctorConsultationHourController.create);
router.put('/:id', authenticateToken, authorizeRoles('doctor', 'admin'), doctorConsultationHourController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), doctorConsultationHourController.remove);

module.exports = router; 