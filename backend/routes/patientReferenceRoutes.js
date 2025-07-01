const express = require('express');
const router = express.Router();
const patientReferenceController = require('../controllers/patientReferenceController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Listar referencias de un paciente
router.get('/:patient_id', authenticateToken, authorizeRoles('admin', 'secretary', 'doctor', 'patient'), patientReferenceController.getAll);

// Agregar referencia
router.post('/:patient_id', authenticateToken, authorizeRoles('admin', 'secretary', 'doctor', 'patient'), patientReferenceController.create);

// Actualizar referencia
router.put('/:patient_id/:reference_id', authenticateToken, authorizeRoles('admin', 'secretary', 'doctor', 'patient'), patientReferenceController.update);

// Eliminar referencia
router.delete('/:patient_id/:reference_id', authenticateToken, authorizeRoles('admin', 'secretary', 'doctor', 'patient'), patientReferenceController.remove);

module.exports = router; 