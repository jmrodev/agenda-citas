const express = require('express');
const router = express.Router();
const secretaryActivityController = require('../controllers/secretaryActivityController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// GET /api/secretary-activities
// Filtros disponibles por query: secretary_id, date, date_from, date_to, activity_type
router.get('/', authMiddleware, roleMiddleware(['admin', 'secretary']), secretaryActivityController.getAll);

// POST /api/secretary-activities
router.post('/', authMiddleware, roleMiddleware(['admin', 'secretary']), secretaryActivityController.create);

module.exports = router; 