const express = require('express');
const router = express.Router();
const patientHealthInsuranceController = require('../controllers/patientHealthInsuranceController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

console.log('🔍 [PatientHealthInsuranceRoutes] Archivo de rutas cargado correctamente');

// Obtener todas las obras sociales de un paciente
router.get('/patients/:patientId/health-insurances', authenticateToken, patientHealthInsuranceController.getPatientHealthInsurances);

// Obtener la obra social principal de un paciente
router.get('/patients/:patientId/health-insurances/primary', authenticateToken, patientHealthInsuranceController.getPrimaryHealthInsurance);

// Agregar una obra social a un paciente
router.post('/patients/:patientId/health-insurances', authenticateToken, authorizeRoles('admin', 'secretary'), patientHealthInsuranceController.addHealthInsuranceToPatient);

// Actualizar una obra social de un paciente
router.put('/patients/:patientId/health-insurances/:patientInsuranceId', authenticateToken, authorizeRoles('admin', 'secretary'), patientHealthInsuranceController.updatePatientHealthInsurance);

// Remover una obra social de un paciente
router.delete('/patients/:patientId/health-insurances/:patientInsuranceId', authenticateToken, authorizeRoles('admin', 'secretary'), patientHealthInsuranceController.removeHealthInsuranceFromPatient);

// Establecer una obra social como principal
router.put('/patients/:patientId/health-insurances/primary', authenticateToken, authorizeRoles('admin', 'secretary'), patientHealthInsuranceController.setPrimaryHealthInsurance);

module.exports = router; 