const express = require('express');
const router = express.Router();
const healthInsuranceController = require('../controllers/healthInsuranceController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const validateQuery = require('../filters/validateQuery');
const { healthInsuranceFiltersSchema } = require('../validations'); // Modificado

console.log('🔍 [HealthInsuranceRoutes] Archivo de rutas cargado correctamente');

// Rutas de prueba al principio para evitar conflictos con parámetros
router.get('/test', (req, res) => {
  console.log('🔍 [HealthInsuranceRoutes] Ruta de test accedida');
  res.json({ message: 'Ruta de test OK', timestamp: new Date().toISOString() });
});

router.get('/test-no-auth', (req, res) => {
  console.log('🔍 [HealthInsuranceRoutes] Ruta de test sin auth accedida');
  res.json({ message: 'Ruta de test sin auth OK', timestamp: new Date().toISOString() });
});

router.get('/', authenticateToken, healthInsuranceController.getAll);
router.get('/filtros', authenticateToken, validateQuery(healthInsuranceFiltersSchema), healthInsuranceController.getAllWithFilters);
router.get('/references/:id', authenticateToken, (req, res, next) => {
  console.log('🔍 [HealthInsuranceRoutes] Ruta /references/:id capturada, ID:', req.params.id);
  healthInsuranceController.getReferences(req, res, next);
}); // Changed route pattern to avoid conflicts
router.get('/:id', authenticateToken, healthInsuranceController.getById); // Added route for getById
router.post('/', authenticateToken, authorizeRoles('admin', 'secretary'), healthInsuranceController.create);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'secretary'), healthInsuranceController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'secretary'), healthInsuranceController.remove);

// Ruta de prueba al final para verificar que el router funciona
router.get('/debug-test', (req, res) => {
  console.log('🔍 [HealthInsuranceRoutes] Ruta debug-test accedida');
  res.json({ 
    message: 'Debug test OK', 
    timestamp: new Date().toISOString(),
    routes: ['/', '/filtros', '/references/:id', '/:id', '/test', '/test-no-auth', '/debug-test']
  });
});

module.exports = router; 