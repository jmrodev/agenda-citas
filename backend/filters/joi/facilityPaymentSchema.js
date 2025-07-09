const Joi = require('joi');

// Helper para validar fecha que puede ser string YYYY-MM-DD o objeto {day, month, year}
const dateOrDateObjectSchema = Joi.alternatives().try(
    Joi.string().isoDate().messages({
        'string.isoDate': 'El formato de fecha debe ser YYYY-MM-DD.'
    }),
    Joi.object({
        day: Joi.number().integer().min(1).max(31).required(),
        month: Joi.number().integer().min(1).max(12).required(),
        year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required()
    }).required()
).messages({
    'alternatives.types': 'La fecha debe ser una cadena YYYY-MM-DD o un objeto con propiedades day, month, year.'
});

const facilityPaymentBaseSchema = {
    doctor_id: Joi.number().integer().positive().required().messages({
        'any.required': 'El ID del doctor es requerido.'
    }),
    amount: Joi.number().precision(2).positive().required().messages({
        'number.base': 'El monto debe ser un número.',
        'number.positive': 'El monto debe ser un valor positivo.',
        'any.required': 'El monto es requerido.'
    }),
    // El controlador espera 'payment_date' en el body
    payment_date: dateOrDateObjectSchema.required().messages({
        'any.required': 'La fecha de pago es requerida.'
    }),
    payment_method: Joi.string().max(50).optional().allow(null, ''),
    description: Joi.string().max(500).optional().allow(null, '')
};

const createFacilityPaymentSchema = Joi.object(facilityPaymentBaseSchema);

const updateFacilityPaymentSchema = Joi.object({
    doctor_id: Joi.number().integer().positive().optional(), // Usualmente no se cambia
    amount: Joi.number().precision(2).positive().optional(),
    payment_date: dateOrDateObjectSchema.optional(),
    payment_method: Joi.string().max(50).optional().allow(null, ''),
    description: Joi.string().max(500).optional().allow(null, '')
}).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar el pago.'
});

module.exports = {
    createFacilityPaymentSchema,
    updateFacilityPaymentSchema
};
