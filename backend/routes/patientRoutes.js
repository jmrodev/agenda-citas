const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const validateQuery = require('../filters/validateQuery');
const patientFiltersSchema = require('../filters/joi/patientFiltersSchema');

// Importar el router anidado para referencias de paciente
const { routerForPatient: patientReferenceNestedRouter } = require('./patientReferenceRoutes'); // Renombrado para claridad

// Anidar las rutas de referencias bajo /:patientId/references
// Es importante que :patientId coincida con el nombre del parámetro esperado en patientReferenceRouter si usa mergeParams.
router.use('/:patientId/references', patientReferenceNestedRouter);


// Rutas existentes de pacientes
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
 * POST /patients/:id/doctors/:doctor_id
 * Agrega un doctor específico a un paciente.
 * Solo accesible para admin y secretaria.
 */
router.post('/:id/doctors/:doctor_id', authenticateToken, authorizeRoles('admin', 'secretary'), patientController.addDoctorToPatient);

/**
 * DELETE /patients/:id/doctors/:doctor_id
 * Elimina la relación específica entre un paciente y un doctor.
 * Solo accesible para admin y secretaria.
 */
router.delete('/:id/doctors/:doctor_id', authenticateToken, authorizeRoles('admin', 'secretary'), patientController.removeDoctorFromPatient);

router.get('/dashboard-stats', authenticateToken, authorizeRoles('admin', 'secretary'), patientController.getDashboardStats);

// Nuevos endpoints para búsqueda avanzada
router.get('/search/stats', authenticateToken, authorizeRoles('admin', 'secretary'), patientController.getSearchStats);
router.get('/search/options', authenticateToken, authorizeRoles('admin', 'secretary'), patientController.getFilterOptions);
router.get('/by-doctor/:doctor_id', authenticateToken, authorizeRoles('admin', 'secretary', 'doctor'), patientController.getPatientsByDoctor);
router.get('/by-insurance/:insurance_id', authenticateToken, authorizeRoles('admin', 'secretary'), patientController.getPatientsByHealthInsurance);

// Endpoint para el reporte de pacientes
router.get('/reports/summary', authenticateToken, authorizeRoles('admin', 'secretary', 'doctor'), patientController.getPatientReportSummary);
// Nota: El path es '/reports/summary'. En el frontend se llama como '/api/patients/reports/summary'.
// El '/api/patients' es el prefijo general de estas rutas, definido en index.js del backend.

module.exports = router; 