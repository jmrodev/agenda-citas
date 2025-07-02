const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const validateQuery = require('../filters/validateQuery');
const patientFiltersSchema = require('../filters/joi/patientFiltersSchema');

router.get('/', authenticateToken, patientController.getAll);
router.get('/filtros', authenticateToken, validateQuery(patientFiltersSchema), patientController.getAllWithFilters);
router.post('/', authenticateToken, authorizeRoles('secretary', 'admin'), patientController.create);
router.put('/:id', authenticateToken, authorizeRoles('secretary', 'admin'), patientController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), patientController.remove);
router.post('/register', authenticateToken, authorizeRoles('admin', 'secretary', 'doctor'), patientController.registerPatientWithUser);
router.get('/me', authenticateToken, authorizeRoles('patient'), patientController.getMe);
router.put('/me', authenticateToken, authorizeRoles('patient'), patientController.updateMe);
router.get('/:id', authenticateToken, authorizeRoles('admin', 'secretary', 'doctor'), patientController.getById);

/**
 * PUT /patients/:id/doctors
 * Reasigna todos los doctores de un paciente.
 * Body: { doctor_ids: [doctor_id1, doctor_id2, ...] }
 * Solo accesible para admin y secretaria.
 */
router.put('/:id/doctors', authenticateToken, authorizeRoles('admin', 'secretary'), patientController.updatePatientDoctors);

/**
 * DELETE /patients/:id/doctors/:doctor_id
 * Elimina la relación específica entre un paciente y un doctor.
 * Solo accesible para admin y secretaria.
 */
router.delete('/:id/doctors/:doctor_id', authenticateToken, authorizeRoles('admin', 'secretary'), patientController.removeDoctorFromPatient);

module.exports = router; 