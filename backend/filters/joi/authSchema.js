const Joi = require('joi');
const {
    usernameSchema,
    requiredEmailSchema,
    passwordSchema,
    optionalPasswordSchema,
    nameSchema,
    optionalPositiveIdSchema,
    phoneSchema
} = require('./baseSchemas');
const {
    USER_ROLES,
    CHAR_LIMITS
} = require('./constants');

// Esquema para el cuerpo de la solicitud de login
const loginSchema = Joi.object({
    username: Joi.string().required().messages({
        'string.empty': 'El nombre de usuario es requerido.',
        'any.required': 'El nombre de usuario es requerido.'
    }),
    password: Joi.string().required().messages({
        'string.empty': 'La contraseña es requerida.',
        'any.required': 'La contraseña es requerida.'
    })
});

// Esquema base para datos de usuario (username, email, password)
const userCredentialsSchema = {
    username: usernameSchema,
    email: requiredEmailSchema,
    password: passwordSchema
};

// Esquema para registrar un nuevo usuario (generalmente por admin)
const registerUserSchema = Joi.object({
    ...userCredentialsSchema,
    nombre: nameSchema.messages({
        'string.empty': 'El nombre es requerido.',
        'any.required': 'El nombre es requerido.'
    }),
    role: Joi.string().valid(...USER_ROLES).required().messages({
        'any.only': 'El rol no es válido.',
        'string.empty': 'El rol es requerido.',
        'any.required': 'El rol es requerido.'
    }),
    entity_id: optionalPositiveIdSchema
});

// Esquema para registrar un doctor junto con su usuario
const registerDoctorWithUserSchema = Joi.object({
    doctor: Joi.object({
        first_name: nameSchema,
        last_name: nameSchema,
        specialty: Joi.string().max(CHAR_LIMITS.SPECIALTY).required(),
        license_number: Joi.string().max(CHAR_LIMITS.LICENSE_NUMBER).optional().allow(null, ''),
        phone: phoneSchema
    }).required(),
    user: Joi.object(userCredentialsSchema).required()
});

// Esquema para registrar una secretaria junto con su usuario
const { createSecretarySchema } = require('./secretarySchema');
const registerSecretaryWithUserSchema = Joi.object({
    secretary: createSecretarySchema.required(),
    user: Joi.object(userCredentialsSchema).required()
});

// Esquema para cambiar la contraseña del propio usuario
const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required().messages({
        'string.empty': 'La contraseña actual es requerida.',
        'any.required': 'La contraseña actual es requerida.'
    }),
    newPassword: passwordSchema
});

// Esquema para que un admin cambie la contraseña de otro usuario
const adminChangeUserPasswordSchema = Joi.object({
    newPassword: passwordSchema
});

module.exports = {
    loginSchema,
    registerUserSchema,
    registerDoctorWithUserSchema,
    registerSecretaryWithUserSchema,
    changePasswordSchema,
    adminChangeUserPasswordSchema
};
