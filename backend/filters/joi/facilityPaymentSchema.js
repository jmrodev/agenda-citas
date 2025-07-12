const Joi = require('joi');
const {
    dateOrDateObjectSchema,
    positiveIdSchema,
    optionalPositiveIdSchema,
    notesSchema
} = require('./baseSchemas');
const {
    CHAR_LIMITS,
    NUMERIC_LIMITS
} = require('./constants');

const facilityPaymentBaseSchema = {
    doctor_id: positiveIdSchema,
    amount: Joi.number().precision(2).positive().required().messages({
        'number.base': 'El monto debe ser un número.',
        'number.positive': 'El monto debe ser un valor positivo.',
        'any.required': 'El monto es requerido.'
    }),
    payment_date: dateOrDateObjectSchema.required().messages({
        'any.required': 'La fecha de pago es requerida.'
    }),
    payment_method: Joi.string().max(CHAR_LIMITS.PAYMENT_METHOD).optional().allow(null, ''),
    description: notesSchema
};

const createFacilityPaymentSchema = Joi.object(facilityPaymentBaseSchema);

const updateFacilityPaymentSchema = Joi.object({
    doctor_id: optionalPositiveIdSchema, // Usualmente no se cambia
    amount: Joi.number().precision(2).positive().optional(),
    payment_date: dateOrDateObjectSchema.optional(),
    payment_method: Joi.string().max(CHAR_LIMITS.PAYMENT_METHOD).optional().allow(null, ''),
    description: notesSchema
}).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar el pago.'
});

module.exports = {
    createFacilityPaymentSchema,
    updateFacilityPaymentSchema
};
