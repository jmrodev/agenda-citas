const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/events', authenticateToken, calendarController.getAllEvents);

module.exports = router; 