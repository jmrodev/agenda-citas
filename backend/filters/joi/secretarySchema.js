const Joi = require('joi');
const {
    nameSchema,
    optionalNameSchema,
    requiredEmailSchema,
    emailSchema,
    phoneSchema,
    usernameSchema,
    optionalPasswordSchema,
    createUpdateSchema
} = require('./baseSchemas');
const {
    CHAR_LIMITS,
    SECRETARY_SHIFTS
} = require('./constants');

// Esquema base para secretarias
const secretaryBaseSchema = Joi.object({
    first_name: nameSchema.messages({
        'string.base': 'El nombre debe ser texto.',
        'string.empty': 'El nombre es requerido.',
        'any.required': 'El nombre es requerido.'
    }),
    last_name: nameSchema.messages({
        'string.base': 'El apellido debe ser texto.',
        'string.empty': 'El apellido es requerido.',
        'any.required': 'El apellido es requerido.'
    }),
    email: requiredEmailSchema.messages({
        'string.base': 'El email debe ser texto.',
        'string.empty': 'El email es requerido.',
        'any.required': 'El email es requerido.'
    }),
    phone: phoneSchema.messages({
        'string.pattern.base': 'El teléfono contiene caracteres inválidos.',
        'string.max': `El teléfono no puede exceder los ${CHAR_LIMITS.PHONE} caracteres.`
    }),
    shift: Joi.string().valid(...SECRETARY_SHIFTS).optional().allow(null, ''),
    entry_time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).optional().allow(null, '').messages({
        'string.pattern.base': 'El formato de hora debe ser HH:MM.'
    }),
    exit_time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).optional().allow(null, '').messages({
        'string.pattern.base': 'El formato de hora debe ser HH:MM.'
    })
});

// Esquema para crear una secretaria
const createSecretarySchema = secretaryBaseSchema;

// Esquema para actualizar una secretaria
const updateSecretarySchema = createUpdateSchema({
    first_name: optionalNameSchema,
    last_name: optionalNameSchema,
    email: emailSchema,
    phone: phoneSchema,
    shift: Joi.string().valid(...SECRETARY_SHIFTS).optional().allow(null, ''),
    entry_time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).optional().allow(null, '').messages({
        'string.pattern.base': 'El formato de hora debe ser HH:MM.'
    }),
    exit_time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).optional().allow(null, '').messages({
        'string.pattern.base': 'El formato de hora debe ser HH:MM.'
    })
});

// Esquema para actualizar secretaria junto con contraseña y datos de usuario
const updateSecretaryWithDetailsSchema = Joi.object({
    secretaryData: updateSecretarySchema.optional(),
    userData: Joi.object({
        username: usernameSchema.optional().messages({
            'string.alphanum': 'El nombre de usuario solo puede contener letras y números.',
            'string.min': `El nombre de usuario debe tener al menos ${CHAR_LIMITS.USERNAME} caracteres.`,
            'string.max': `El nombre de usuario no puede exceder los ${CHAR_LIMITS.USERNAME} caracteres.`
        })
    }).optional(),
    passwordData: Joi.object({
        currentPassword: Joi.string().when('$isSecretaryEditingSelf', { 
            is: true, 
            then: Joi.required() 
        }).messages({
            'any.required': 'La contraseña actual es requerida para que la secretaria cambie su propia contraseña.'
        }),
        adminPassword: Joi.string().when('$isAdminEditing', { 
            is: true, 
            then: Joi.when('newPassword', {
                is: Joi.exist(), 
                then: Joi.required()
            })
        }).messages({
            'any.required': 'La contraseña de administrador es requerida si un administrador está cambiando la contraseña.'
        }),
        newPassword: optionalPasswordSchema
    }).optional()
}).or('secretaryData', 'userData', 'passwordData').messages({
    'object.missing': 'Debe proporcionar secretaryData, userData o passwordData para la actualización.'
});

module.exports = {
    createSecretarySchema,
    updateSecretarySchema,
    updateSecretaryWithDetailsSchema
};
