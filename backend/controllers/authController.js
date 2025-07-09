const userService = require('../services/userService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';

// Las funciones de validación manual (validateUsername, validateName, etc.) se eliminan
// ya que Joi maneja la validación de formato/presencia.

/**
 * Registro de usuarios (solo admin puede crear usuarios nuevos)
 * Requiere: Authorization: Bearer <token_admin>
 * Body: { username, email, password, role, entity_id, nombre }
 * La validación del body es manejada por Joi (registerUserSchema)
 */
async function register(req, res) {
  try {
    // La autorización de rol 'admin' ya está en la ruta.
    // req.body ya está validado por Joi.
    const { username, email, password, role, entity_id, nombre } = req.body;

    // Verificar unicidad (lógica de negocio)
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
    // req.body ya está validado por Joi (loginSchema)
    const { username, password } = req.body;

    const user = await userService.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    // Log temporal para depuración
    console.log('Intento login:', { username, password, hash: user.password });
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

/**
 * Registro combinado de doctor y usuario (admin o secretaria)
 * Body: { doctor: {...}, user: {...} }
 * Validación del body por Joi (registerDoctorWithUserSchema)
 */
async function registerDoctorWithUser(req, res) {
  try {
    // Autorización de rol ya en la ruta.
    // req.body ya validado por Joi.
    const { doctor, user } = req.body;

    // Unicidad usuario/email (lógica de negocio)
    const existingUser = await userService.getUserByUsername(user.username);
    if (existingUser) {
      return res.status(409).json({ error: 'El nombre de usuario ya está registrado' });
    }
    const existingEmail = await userService.getUserByEmail(user.email);
    if (existingEmail) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    // Validar y convertir fecha si es objeto (Joi no convierte, solo valida formato)
    // Si el esquema Joi para doctor asegura que last_earnings_collection_date es un string YYYY-MM-DD,
    // esta conversión manual podría no ser necesaria o necesitaría ajustarse.
    // Por ahora, se asume que el servicio de doctor puede manejar el formato que Joi valida.
    // Si el esquema Joi para doctor permite un objeto fecha, el servicio de doctor debe manejarlo.
    // const { parseAndValidateDate } = require('../utils/date'); // Si se necesita parseo post-Joi
    // if (doctor.last_earnings_collection_date && typeof doctor.last_earnings_collection_date === 'object') {
    //   doctor.last_earnings_collection_date = parseAndValidateDate(doctor.last_earnings_collection_date, 'last_earnings_collection_date', true);
    // }

    // Crear doctor
    const doctorService = require('../services/doctorService');
    const newDoctor = await doctorService.createDoctor(doctor);
    // Crear usuario
    const hashed = await bcrypt.hash(user.password, 10);
    const newUser = await userService.registerUser({
      username: user.username,
      email: user.email,
      password: hashed,
      role: 'doctor',
      entity_id: newDoctor.doctor_id
    });
    res.status(201).json({ doctor: newDoctor, user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Registro combinado de secretaria y usuario (solo admin)
 * Body: { secretary: {...}, user: {...} }
 * Validación del body por Joi (registerSecretaryWithUserSchema)
 */
async function registerSecretaryWithUser(req, res) {
  try {
    // Autorización de rol ya en la ruta.
    // req.body ya validado por Joi.
    const { secretary, user } = req.body;

    // Unicidad usuario/email
    const existingUser = await userService.getUserByUsername(user.username);
    if (existingUser) {
      return res.status(409).json({ error: 'El nombre de usuario ya está registrado' });
    }
    const existingEmail = await userService.getUserByEmail(user.email);
    if (existingEmail) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }
    // Crear secretaria
    const secretaryService = require('../services/secretaryService');
    const newSecretary = await secretaryService.createSecretary(secretary);
    // Crear usuario
    const hashed = await bcrypt.hash(user.password, 10);
    const newUser = await userService.registerUser({
      username: user.username,
      email: user.email,
      password: hashed,
      role: 'secretary',
      entity_id: newSecretary.secretary_id
    });
    res.status(201).json({ secretary: newSecretary, user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Cambiar contraseña de usuario
 * Body: { currentPassword, newPassword }
 */
async function changePassword(req, res) {
  try {
    // req.body ya validado por Joi (changePasswordSchema)
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.user_id;

    // Obtener usuario actual
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar contraseña actual
    const validCurrentPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validCurrentPassword) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }

    // Hashear nueva contraseña
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    const updated = await userService.updateUserPassword(userId, hashedNewPassword);
    if (!updated) {
      return res.status(500).json({ error: 'Error al actualizar la contraseña' });
    }

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error('Error al cambiar contraseña:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * Cambiar contraseña de otro usuario (solo admin)
 * Body: { newPassword }
 */
async function changeUserPassword(req, res) {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;

    // Solo admin puede cambiar contraseñas de otros usuarios
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Solo el administrador puede cambiar contraseñas de otros usuarios' });
    }

    if (!newPassword) {
      return res.status(400).json({ error: 'Nueva contraseña es requerida' });
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número' });
    }

    // Verificar que el usuario existe
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Hashear nueva contraseña
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    const updated = await userService.updateUserPassword(userId, hashedNewPassword);
    if (!updated) {
      return res.status(500).json({ error: 'Error al actualizar la contraseña' });
    }

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error('Error al cambiar contraseña de usuario:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * Función temporal para obtener usuarios (solo para modal de secretaria)
 */
async function getUsers(req, res) {
  try {
    // Solo admin puede ver esta información
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Solo el administrador puede ver esta información' });
    }

    const [rows] = await pool.query('SELECT user_id, username, email, role, entity_id FROM users');
    res.json({ users: rows });
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { register, login, registerDoctorWithUser, registerSecretaryWithUser, changePassword, changeUserPassword, getUsers }; 