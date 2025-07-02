const userService = require('../services/userService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';

function validateUsername(username) {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}
function validateName(nombre) {
  return nombre && nombre.trim().length >= 2 && nombre.trim().length <= 50;
}
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

/**
 * Registro de usuarios (solo admin puede crear usuarios nuevos)
 * Requiere: Authorization: Bearer <token_admin>
 * Body: { username, email, password, role, entity_id }
 */
async function register(req, res) {
  try {
    // Solo admin puede crear usuarios (la protección está en la ruta, pero se documenta aquí)
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Solo el administrador puede crear usuarios nuevos.' });
    }
    const { username, email, password, role, entity_id, nombre } = req.body;
    if (!validateName(nombre)) {
      return res.status(400).json({ error: 'El nombre es obligatorio (2-50 caracteres)' });
    }
    if (!username) {
      return res.status(400).json({ error: 'El nombre de usuario es obligatorio' });
    }
    if (!validateUsername(username)) {
      return res.status(400).json({ error: 'Solo letras, números y guion bajo (3-20 caracteres, sin espacios)' });
    }
    if (!email) {
      return res.status(400).json({ error: 'El email es obligatorio' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Email no válido' });
    }
    if (!password) {
      return res.status(400).json({ error: 'La contraseña es obligatoria' });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Mínimo 8 caracteres, una mayúscula, una minúscula y un número' });
    }
    if (!role) {
      return res.status(400).json({ error: 'Selecciona un rol' });
    }
    const existingUser = await userService.getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ error: 'El nombre de usuario ya está registrado' });
    }
    const existingEmail = await userService.getUserByEmail(email);
    if (existingEmail) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await userService.registerUser({ username, email, password: hashed, role, entity_id });
    res.status(201).json({ user_id: user.user_id, username: user.username, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Faltan nombre de usuario o contraseña' });
    }
    const user = await userService.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const token = jwt.sign({ user_id: user.user_id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { user_id: user.user_id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { register, login }; 