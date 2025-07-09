const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validateBody } = require('../filters/validateQuery');
const { createDoctorSchema, updateDoctorSchema } = require('../validations');

// GET /doctors - Listar todos los doctores
// Accesible para admin, secretary, doctor
router.get(
    '/',
    authenticateToken,
    authorizeRoles('admin', 'secretary', 'doctor'),
    doctorController.getAll
);

// POST /doctors - Crear un nuevo doctor
// Accesible solo para admin, secretary
router.post(
    '/',
    authenticateToken,
    authorizeRoles('admin', 'secretary'),
    validateBody(createDoctorSchema),
    doctorController.create
);

// GET /doctors/dashboard-stats - Obtener estadísticas de doctores
// Accesible para admin, secretary
router.get(
    '/dashboard-stats',
    authenticateToken,
    authorizeRoles('admin', 'secretary'),
    doctorController.getDashboardStats
);

// GET /doctors/:id - Obtener un doctor por ID (con sus pacientes)
// Accesible para admin, secretary, doctor
router.get(
    '/:id',
    authenticateToken,
    authorizeRoles('admin', 'secretary', 'doctor'),
    doctorController.getById
);

// PUT /doctors/:id - Actualizar un doctor
// Accesible solo para admin, secretary
router.put(
    '/:id',
    authenticateToken,
    authorizeRoles('admin', 'secretary'),
    validateBody(updateDoctorSchema),
    doctorController.update
);

// DELETE /doctors/:id - Eliminar un doctor
// Accesible solo para admin, secretary
router.delete(
    '/:id',
    authenticateToken,
    authorizeRoles('admin', 'secretary'),
    doctorController.remove
);

// GET /doctors/:id/patients - Obtener los pacientes de un doctor específico
// Accesible para admin, secretary, doctor (un doctor puede ver sus propios pacientes)
router.get(
    '/:id/patients',
    authenticateToken,
    authorizeRoles('admin', 'secretary', 'doctor'), // Un doctor podría necesitar ver su lista de pacientes
    doctorController.getPatientsForDoctor
);

module.exports = router; 