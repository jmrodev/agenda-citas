const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validateBody } = require('../filters/validateQuery'); // Importar validateBody
const {
    loginSchema,
    registerUserSchema,
    registerDoctorWithUserSchema,
    registerSecretaryWithUserSchema,
    changePasswordSchema,
    adminChangeUserPasswordSchema,
    updateUserConfigSchema // Asegúrate de que este esquema esté exportado en ../validations
} = require('../validations');
const { registerDoctorWithUser, registerSecretaryWithUser } = require('../controllers/authController');
const userConfigController = require('../controllers/userConfigController');

router.post('/register',
    authenticateToken,
    authorizeRoles('admin'),
    validateBody(registerUserSchema),
    authController.register
);

router.post('/register-doctor',
    authenticateToken,
    authorizeRoles('admin', 'secretary'),
    validateBody(registerDoctorWithUserSchema),
    registerDoctorWithUser
);
router.post('/register-secretary',
    authenticateToken,
    authorizeRoles('admin'),
    validateBody(registerSecretaryWithUserSchema),
    registerSecretaryWithUser
);

router.post('/login', validateBody(loginSchema), authController.login);

// Rutas para cambio de contraseña
router.post('/change-password',
    authenticateToken,
    validateBody(changePasswordSchema),
    authController.changePassword
);
router.post('/users/:userId/change-password',
    authenticateToken,
    authorizeRoles('admin'),
    validateBody(adminChangeUserPasswordSchema),
    authController.changeUserPassword
);

// Ruta temporal para obtener usuarios (solo para modal de secretaria)
router.get('/users', authenticateToken, authorizeRoles('admin'), authController.getUsers);

router.get('/user/config', authenticateToken, userConfigController.getConfig);
router.put('/user/config',
    authenticateToken,
    validateBody(updateUserConfigSchema),
    userConfigController.updateConfig
);

module.exports = router; 