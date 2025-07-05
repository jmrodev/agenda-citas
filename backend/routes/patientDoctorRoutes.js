const express = require('express');
const router = express.Router();
const patientDoctorController = require('../controllers/patientDoctorController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Rutas para obtener relaciones
router.get('/patient/:patient_id/doctors', authenticateToken, authorizeRoles('admin', 'secretary', 'doctor'), patientDoctorController.getDoctorsByPatient);
router.get('/doctor/:doctor_id/patients', authenticateToken, authorizeRoles('admin', 'secretary', 'doctor'), patientDoctorController.getPatientsByDoctor);

// Rutas para asignar múltiples relaciones (reemplazar todas)
router.put('/patient/:patient_id/doctors', authenticateToken, authorizeRoles('admin', 'secretary'), patientDoctorController.assignDoctorsToPatient);
router.put('/doctor/:doctor_id/patients', authenticateToken, authorizeRoles('admin', 'secretary'), patientDoctorController.assignPatientsToDoctor);

// Rutas para agregar relaciones individuales
router.post('/patient/:patient_id/doctors/:doctor_id', authenticateToken, authorizeRoles('admin', 'secretary'), patientDoctorController.addDoctorToPatient);
router.post('/doctor/:doctor_id/patients/:patient_id', authenticateToken, authorizeRoles('admin', 'secretary'), patientDoctorController.addPatientToDoctor);

// Rutas para eliminar relaciones individuales
router.delete('/patient/:patient_id/doctors/:doctor_id', authenticateToken, authorizeRoles('admin', 'secretary'), patientDoctorController.removeDoctorFromPatient);
router.delete('/doctor/:doctor_id/patients/:patient_id', authenticateToken, authorizeRoles('admin', 'secretary'), patientDoctorController.removePatientFromDoctor);

// Rutas para estadísticas
router.get('/stats', authenticateToken, authorizeRoles('admin', 'secretary'), patientDoctorController.getRelationshipStats);

// Rutas para búsqueda con filtros
router.get('/doctor/:doctor_id/patients/search', authenticateToken, authorizeRoles('admin', 'secretary', 'doctor'), patientDoctorController.searchPatientsByDoctor);
router.get('/patient/:patient_id/doctors/search', authenticateToken, authorizeRoles('admin', 'secretary', 'doctor'), patientDoctorController.searchDoctorsByPatient);

module.exports = router; 