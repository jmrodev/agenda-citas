const express = require('express');
const patientReferenceController = require('../controllers/patientReferenceController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
// const validateQuery = require('../filters/validateQuery'); // No se usa en las nuevas rutas directas
// const { listReferencePersonsSchema } = require('../filters/joi/referencePersonFiltersSchema'); // Para el GET global si se implementa

// Router para rutas anidadas bajo /api/patients/:patientId/references
const routerForPatient = express.Router({ mergeParams: true }); // mergeParams para acceder a :patientId

// POST /api/patients/:patientId/references - Crear una nueva referencia para un paciente
routerForPatient.post('/',
  authenticateToken,
  authorizeRoles('admin', 'secretary'), // Solo admin/secretary pueden crear
  patientReferenceController.create
);

// GET /api/patients/:patientId/references - Listar todas las referencias de un paciente específico
routerForPatient.get('/',
  authenticateToken,
  authorizeRoles('admin', 'secretary', 'doctor'), // Admin, secretary, y doctor pueden ver
  patientReferenceController.listByPatient
);

// Router para operaciones directas sobre una referencia específica por su ID: /api/patient-references/:id
const singleReferenceRouter = express.Router();

// GET /api/patient-references/:id - Obtener una referencia específica por su ID
singleReferenceRouter.get('/:id',
  authenticateToken,
  authorizeRoles('admin', 'secretary', 'doctor'),
  patientReferenceController.getById
);

// PUT /api/patient-references/:id - Actualizar una referencia específica
singleReferenceRouter.put('/:id',
  authenticateToken,
  authorizeRoles('admin', 'secretary'),
  patientReferenceController.update
);

// DELETE /api/patient-references/:id - Eliminar una referencia específica
singleReferenceRouter.delete('/:id',
  authenticateToken,
  authorizeRoles('admin', 'secretary'),
  patientReferenceController.remove
);

module.exports = {
  routerForPatient,      // Se montará como /api/patients/:patientId/references
  singleReferenceRouter  // Se montará como /api/patient-references
};