const express = require('express');
const router = express.Router();
const secretaryActivityController = require('../controllers/secretaryActivityController');

router.get('/', secretaryActivityController.getAll);

module.exports = router; 