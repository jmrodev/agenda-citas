const Joi = require('joi');

// Esquema base para los datos de una secretaria
const secretaryBaseSchema = Joi.object({
    first_name: Joi.string().min(2).max(100).required().messages({
        'string.base': 'El nombre debe ser texto.',
        'string.empty': 'El nombre es requerido.',
        'string.min': 'El nombre debe tener al menos 2 caracteres.',
        'string.max': 'El nombre no puede exceder los 100 caracteres.',
        'any.required': 'El nombre es requerido.'
    }),
    last_name: Joi.string().min(2).max(100).required().messages({
        'string.base': 'El apellido debe ser texto.',
        'string.empty': 'El apellido es requerido.',
        'string.min': 'El apellido debe tener al menos 2 caracteres.',
        'string.max': 'El apellido no puede exceder los 100 caracteres.',
        'any.required': 'El apellido es requerido.'
    }),
    email: Joi.string().email().required().messages({
        'string.base': 'El email debe ser texto.',
        'string.empty': 'El email es requerido.',
        'string.email': 'Debe ingresar un email válido.',
        'any.required': 'El email es requerido.'
    }),
    phone: Joi.string().pattern(/^[0-9+\-\s()]*$/).max(30).allow(null, '').messages({
        'string.pattern.base': 'El teléfono contiene caracteres inválidos.',
        'string.max': 'El teléfono no puede exceder los 30 caracteres.'
    }),
    // user_id es manejado internamente o por el servicio de creación de usuario asociado
});

// Esquema para crear una secretaria (solo datos de la entidad secretaria)
// La creación del usuario asociado (username, password) se maneja en authController o un esquema combinado.
const createSecretarySchema = secretaryBaseSchema;

// Esquema para actualizar una secretaria
const updateSecretarySchema = Joi.object({
    first_name: Joi.string().min(2).max(100).optional(),
    last_name: Joi.string().min(2).max(100).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().pattern(/^[0-9+\-\s()]*$/).max(30).allow(null, '').optional()
}).min(1).messages({ // Al menos un campo para actualizar
    'object.min': 'Debe proporcionar al menos un campo para actualizar.'
});


// Esquema para actualizar secretaria junto con contraseña y datos de usuario
const updateSecretaryWithDetailsSchema = Joi.object({
    secretaryData: updateSecretarySchema.optional(), // Datos de la secretaria a actualizar
    userData: Joi.object({ // Datos del usuario a actualizar (username)
        username: Joi.string().alphanum().min(3).max(30).optional().messages({ // Asumiendo que el username puede cambiar
            'string.alphanum': 'El nombre de usuario solo puede contener letras y números.',
            'string.min': 'El nombre de usuario debe tener al menos 3 caracteres.',
            'string.max': 'El nombre de usuario no puede exceder los 30 caracteres.'
        })
    }).optional(),
    passwordData: Joi.object({ // Datos para el cambio de contraseña
        currentPassword: Joi.string().when('$isSecretaryEditingSelf', { is: true, then: Joi.required() }).messages({
            'any.required': 'La contraseña actual es requerida para que la secretaria cambie su propia contraseña.'
        }),
        adminPassword: Joi.string().when('$isAdminEditing', { is: true, then: Joi.when('newPassword', {is: Joi.exist(), then: Joi.required()}) }).messages({
             'any.required': 'La contraseña de administrador es requerida si un administrador está cambiando la contraseña.'
        }),
        newPassword: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/).optional().messages({
            'string.min': 'La nueva contraseña debe tener al menos 8 caracteres.',
            'string.pattern.base': 'La nueva contraseña debe contener al menos una mayúscula, una minúscula y un número.'
        })
    }).optional()
}).or('secretaryData', 'userData', 'passwordData').messages({ // Al menos uno de los objetos debe estar presente
    'object.missing': 'Debe proporcionar secretaryData, userData o passwordData para la actualización.'
});


module.exports = {
    createSecretarySchema,
    updateSecretarySchema,
    updateSecretaryWithDetailsSchema
};
