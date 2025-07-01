const express = require('express');
const router = express.Router();
const healthInsuranceController = require('../controllers/healthInsuranceController');

router.get('/', healthInsuranceController.getAll);

module.exports = router; 