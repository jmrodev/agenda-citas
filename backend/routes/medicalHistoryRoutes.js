const express = require('express');
const router = express.Router();
const medicalHistoryController = require('../controllers/medicalHistoryController');

router.get('/', medicalHistoryController.getAll);

module.exports = router; 