const Joi = require('joi');
const {
    CHAR_LIMITS,
    NUMERIC_LIMITS
} = require('./constants');

// ===== ESQUEMAS BASE COMPARTIDOS =====

// Esquema para validar fecha que puede ser string YYYY-MM-DD o objeto {day, month, year}
const dateOrDateObjectSchema = Joi.alternatives().try(
    Joi.string().isoDate().messages({
        'string.isoDate': 'El formato de fecha debe ser YYYY-MM-DD.'
    }),
    Joi.object({
        day: Joi.number().integer().min(NUMERIC_LIMITS.MIN_DAY).max(NUMERIC_LIMITS.MAX_DAY).required(),
        month: Joi.number().integer().min(NUMERIC_LIMITS.MIN_MONTH).max(NUMERIC_LIMITS.MAX_MONTH).required(),
        year: Joi.number().integer().min(NUMERIC_LIMITS.MIN_YEAR).max(NUMERIC_LIMITS.MAX_YEAR).required()
    }).required()
).messages({
    'alternatives.types': 'La fecha debe ser una cadena YYYY-MM-DD o un objeto con propiedades day, month, year.'
});

// Esquema para validar hora en formato HH:MM
const timeSchema = Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).messages({
    'string.pattern.base': 'El formato de hora debe ser HH:MM.'
});

// Esquema para validar teléfono
const phoneSchema = Joi.string().pattern(/^[0-9+\-\s()]*$/).max(CHAR_LIMITS.PHONE).optional().allow(null, '').messages({
    'string.pattern.base': 'El formato de teléfono no es válido.',
    'string.max': `El teléfono no puede exceder los ${CHAR_LIMITS.PHONE} caracteres.`
});

// Esquema para validar email
const emailSchema = Joi.string().email().max(CHAR_LIMITS.EMAIL).optional().allow(null, '').messages({
    'string.email': 'Debe proporcionar un email válido.',
    'string.max': `El email no puede exceder los ${CHAR_LIMITS.EMAIL} caracteres.`
});

// Esquema para validar email requerido
const requiredEmailSchema = Joi.string().email().max(CHAR_LIMITS.EMAIL).required().messages({
    'string.email': 'Debe proporcionar un email válido.',
    'string.max': `El email no puede exceder los ${CHAR_LIMITS.EMAIL} caracteres.`,
    'string.empty': 'El email es requerido.',
    'any.required': 'El email es requerido.'
});

// Esquema para validar contraseña
const passwordSchema = Joi.string().min(NUMERIC_LIMITS.MIN_PASSWORD_LENGTH).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/).required().messages({
    'string.min': `La contraseña debe tener al menos ${NUMERIC_LIMITS.MIN_PASSWORD_LENGTH} caracteres.`,
    'string.pattern.base': 'La contraseña debe contener al menos una mayúscula, una minúscula y un número.',
    'string.empty': 'La contraseña es requerida.',
    'any.required': 'La contraseña es requerida.'
});

// Esquema para validar contraseña opcional (para actualizaciones)
const optionalPasswordSchema = Joi.string().min(NUMERIC_LIMITS.MIN_PASSWORD_LENGTH).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/).optional().allow(null, '').messages({
    'string.min': `La contraseña debe tener al menos ${NUMERIC_LIMITS.MIN_PASSWORD_LENGTH} caracteres.`,
    'string.pattern.base': 'La contraseña debe contener al menos una mayúscula, una minúscula y un número.'
});

// Esquema para validar username
const usernameSchema = Joi.string().alphanum().min(NUMERIC_LIMITS.MIN_USERNAME_LENGTH).max(CHAR_LIMITS.USERNAME).required().messages({
    'string.alphanum': 'El nombre de usuario solo puede contener letras y números.',
    'string.min': `El nombre de usuario debe tener al menos ${NUMERIC_LIMITS.MIN_USERNAME_LENGTH} caracteres.`,
    'string.max': `El nombre de usuario no puede exceder los ${CHAR_LIMITS.USERNAME} caracteres.`,
    'string.empty': 'El nombre de usuario es requerido.',
    'any.required': 'El nombre de usuario es requerido.'
});

// Esquema para validar nombre (first_name, last_name)
const nameSchema = Joi.string().min(NUMERIC_LIMITS.MIN_NAME_LENGTH).max(CHAR_LIMITS.NAME).required().messages({
    'string.min': `El nombre debe tener al menos ${NUMERIC_LIMITS.MIN_NAME_LENGTH} caracteres.`,
    'string.max': `El nombre no puede exceder los ${CHAR_LIMITS.NAME} caracteres.`,
    'string.empty': 'El nombre es requerido.',
    'any.required': 'El nombre es requerido.'
});

// Esquema para validar nombre opcional
const optionalNameSchema = Joi.string().min(NUMERIC_LIMITS.MIN_NAME_LENGTH).max(CHAR_LIMITS.NAME).optional().allow(null, '').messages({
    'string.min': `El nombre debe tener al menos ${NUMERIC_LIMITS.MIN_NAME_LENGTH} caracteres.`,
    'string.max': `El nombre no puede exceder los ${CHAR_LIMITS.NAME} caracteres.`
});

// Esquema para validar DNI
const dniSchema = Joi.string().alphanum().min(NUMERIC_LIMITS.MIN_DNI_LENGTH).max(CHAR_LIMITS.DNI).required().messages({
    'string.empty': 'El DNI es requerido.',
    'any.required': 'El DNI es requerido.',
    'string.min': `El DNI debe tener al menos ${NUMERIC_LIMITS.MIN_DNI_LENGTH} caracteres.`,
    'string.max': `El DNI no puede exceder los ${CHAR_LIMITS.DNI} caracteres.`
});

// Esquema para validar DNI opcional
const optionalDniSchema = Joi.string().alphanum().min(NUMERIC_LIMITS.MIN_DNI_LENGTH).max(CHAR_LIMITS.DNI).optional().allow(null, '').messages({
    'string.min': `El DNI debe tener al menos ${NUMERIC_LIMITS.MIN_DNI_LENGTH} caracteres.`,
    'string.max': `El DNI no puede exceder los ${CHAR_LIMITS.DNI} caracteres.`
});

// Esquema para validar ID positivo
const positiveIdSchema = Joi.number().integer().positive().required().messages({
    'number.base': 'El ID debe ser un número.',
    'number.positive': 'El ID debe ser un número positivo.',
    'any.required': 'El ID es requerido.'
});

// Esquema para validar ID positivo opcional
const optionalPositiveIdSchema = Joi.number().integer().positive().optional().allow(null).messages({
    'number.base': 'El ID debe ser un número.',
    'number.positive': 'El ID debe ser un número positivo.'
});

// Esquema para validar array de IDs positivos
const positiveIdsArraySchema = Joi.array().items(Joi.number().integer().positive()).optional().allow(null).messages({
    'array.base': 'Debe ser un array de IDs.',
    'array.items': 'Todos los elementos deben ser números positivos.'
});

// Esquema para validar dirección
const addressSchema = Joi.string().max(CHAR_LIMITS.ADDRESS).optional().allow(null, '').messages({
    'string.max': `La dirección no puede exceder los ${CHAR_LIMITS.ADDRESS} caracteres.`
});

// Esquema para validar notas/descripción
const notesSchema = Joi.string().max(CHAR_LIMITS.NOTES).optional().allow(null, '').messages({
    'string.max': `Las notas no pueden exceder los ${CHAR_LIMITS.NOTES} caracteres.`
});

// Esquema para validar fecha de nacimiento (con límite de año actual)
const birthDateSchema = Joi.alternatives().try(
    Joi.string().isoDate().messages({
        'string.isoDate': 'El formato de fecha debe ser YYYY-MM-DD.'
    }),
    Joi.object({
        day: Joi.number().integer().min(NUMERIC_LIMITS.MIN_DAY).max(NUMERIC_LIMITS.MAX_DAY).required(),
        month: Joi.number().integer().min(NUMERIC_LIMITS.MIN_MONTH).max(NUMERIC_LIMITS.MAX_MONTH).required(),
        year: Joi.number().integer().min(NUMERIC_LIMITS.MIN_YEAR).max(new Date().getFullYear()).required()
    }).required()
).messages({
    'alternatives.types': 'La fecha debe ser una cadena YYYY-MM-DD o un objeto con propiedades day, month, year.'
});

// ===== FUNCIONES HELPER =====

// Función para crear esquema de actualización con validación de mínimo 1 campo
const createUpdateSchema = (fields) => {
    return Joi.object(fields).min(1).messages({
        'object.min': 'Debe proporcionar al menos un campo para actualizar.'
    });
};

// Función para crear esquema con validación condicional por rol
const createRoleConditionalSchema = (baseFields, roleCondition) => {
    return Joi.object(baseFields).when('$userRole', {
        is: roleCondition.role,
        then: roleCondition.then
    });
};

module.exports = {
    // Esquemas base
    dateOrDateObjectSchema,
    timeSchema,
    phoneSchema,
    emailSchema,
    requiredEmailSchema,
    passwordSchema,
    optionalPasswordSchema,
    usernameSchema,
    nameSchema,
    optionalNameSchema,
    dniSchema,
    optionalDniSchema,
    positiveIdSchema,
    optionalPositiveIdSchema,
    positiveIdsArraySchema,
    addressSchema,
    notesSchema,
    birthDateSchema,
    
    // Funciones helper
    createUpdateSchema,
    createRoleConditionalSchema
}; 