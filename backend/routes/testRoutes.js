const express = require('express');
const router = express.Router();

console.log('🔍 [TestRoutes] Archivo de rutas de prueba cargado');

router.get('/ping', (req, res) => {
  console.log('🔍 [TestRoutes] Ruta /ping accedida');
  res.json({ message: 'Ping OK', timestamp: new Date().toISOString() });
});

router.get('/health', (req, res) => {
  console.log('🔍 [TestRoutes] Ruta /health accedida');
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

module.exports = router; 