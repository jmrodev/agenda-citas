const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';

const authenticateToken = (req, res, next) => {
  console.log('🔍 [AuthMiddleware] Petición recibida:', req.method, req.path);
  console.log('🔍 [AuthMiddleware] Headers:', req.headers);
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('❌ [AuthMiddleware] No hay token');
    return res.status(401).json({ error: 'Token requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('❌ [AuthMiddleware] Token inválido:', err.message);
      return res.status(403).json({ error: 'Token inválido' });
    }
    console.log('✅ [AuthMiddleware] Token válido, usuario:', user);
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken }; 