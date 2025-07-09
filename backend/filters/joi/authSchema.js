const Joi = require('joi');

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
    username: Joi.string().alphanum().min(3).max(30).required().messages({
        'string.alphanum': 'El nombre de usuario solo puede contener letras y números.',
        'string.min': 'El nombre de usuario debe tener al menos 3 caracteres.',
        'string.max': 'El nombre de usuario no puede exceder los 30 caracteres.',
        'string.empty': 'El nombre de usuario es requerido.',
        'any.required': 'El nombre de usuario es requerido.'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Debe proporcionar un email válido.',
        'string.empty': 'El email es requerido.',
        'any.required': 'El email es requerido.'
    }),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/).required().messages({
        'string.min': 'La contraseña debe tener al menos 8 caracteres.',
        'string.pattern.base': 'La contraseña debe contener al menos una mayúscula, una minúscula y un número.',
        'string.empty': 'La contraseña es requerida.',
        'any.required': 'La contraseña es requerida.'
    })
};

// Esquema para registrar un nuevo usuario (generalmente por admin)
const registerUserSchema = Joi.object({
    ...userCredentialsSchema,
    nombre: Joi.string().min(2).max(100).required().messages({ // Nombre completo de la persona asociada al usuario
        'string.min': 'El nombre debe tener al menos 2 caracteres.',
        'string.max': 'El nombre no puede exceder los 100 caracteres.',
        'string.empty': 'El nombre es requerido.',
        'any.required': 'El nombre es requerido.'
    }),
    role: Joi.string().valid('admin', 'doctor', 'patient', 'secretary').required().messages({
        'any.only': 'El rol no es válido.',
        'string.empty': 'El rol es requerido.',
        'any.required': 'El rol es requerido.'
    }),
    entity_id: Joi.number().integer().positive().optional().allow(null) // ID de la entidad asociada (doctor_id, patient_id, etc.)
});

// Esquema para registrar un doctor junto con su usuario
// Asumimos campos básicos para el doctor aquí. Un esquema más completo de doctor se definirá por separado.
const registerDoctorWithUserSchema = Joi.object({
    doctor: Joi.object({
        first_name: Joi.string().min(2).max(100).required(),
        last_name: Joi.string().min(2).max(100).required(),
        specialty: Joi.string().max(100).required(),
        license_number: Joi.string().max(50).optional().allow(null, ''),
        phone: Joi.string().max(30).optional().allow(null, ''),
        // Otros campos de doctor pueden añadirse aquí o referenciar un doctorBaseSchema importado
    }).required(),
    user: Joi.object(userCredentialsSchema).required()
});

// Esquema para registrar una secretaria junto con su usuario
// Asumimos campos básicos para la secretaria aquí. Se usará el createSecretarySchema para la entidad.
const { createSecretarySchema } = require('./secretarySchema'); // Importar para reutilizar
const registerSecretaryWithUserSchema = Joi.object({
    secretary: createSecretarySchema.required(), // Reutiliza el esquema de creación de secretaria
    user: Joi.object(userCredentialsSchema).required()
});


// Esquema para cambiar la contraseña del propio usuario
const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required().messages({
        'string.empty': 'La contraseña actual es requerida.',
        'any.required': 'La contraseña actual es requerida.'
    }),
    newPassword: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/).required().messages({
        'string.min': 'La nueva contraseña debe tener al menos 8 caracteres.',
        'string.pattern.base': 'La nueva contraseña debe contener al menos una mayúscula, una minúscula y un número.',
        'string.empty': 'La nueva contraseña es requerida.',
        'any.required': 'La nueva contraseña es requerida.'
    })
});

// Esquema para que un admin cambie la contraseña de otro usuario
const adminChangeUserPasswordSchema = Joi.object({
    newPassword: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/).required().messages({
        'string.min': 'La nueva contraseña debe tener al menos 8 caracteres.',
        'string.pattern.base': 'La nueva contraseña debe contener al menos una mayúscula, una minúscula y un número.',
        'string.empty': 'La nueva contraseña es requerida.',
        'any.required': 'La nueva contraseña es requerida.'
    })
});


module.exports = {
    loginSchema,
    registerUserSchema,
    registerDoctorWithUserSchema,
    registerSecretaryWithUserSchema,
    changePasswordSchema,
    adminChangeUserPasswordSchema
};
