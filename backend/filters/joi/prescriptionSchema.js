const Joi = require('joi');
const {
    positiveIdSchema,
    optionalPositiveIdSchema,
    dateOrDateObjectSchema,
    notesSchema,
    createUpdateSchema
} = require('./baseSchemas');
const {
    CHAR_LIMITS,
    PAYMENT_STATUSES
} = require('./constants');

// Esquema para un medicamento individual dentro de una prescripción
const medicationItemSchema = Joi.object({
    medication_name: Joi.string().max(CHAR_LIMITS.MEDICATION).required().messages({
        'string.empty': 'El nombre del medicamento es requerido.',
        'any.required': 'El nombre del medicamento es requerido.'
    }),
    dose: Joi.string().max(CHAR_LIMITS.DOSE).optional().allow(null, ''),
    instructions: Joi.string().max(CHAR_LIMITS.INSTRUCTIONS).optional().allow(null, '')
});

const prescriptionBaseSchema = {
    patient_id: positiveIdSchema.messages({
        'any.required': 'El ID del paciente es requerido.'
    }),
    doctor_id: positiveIdSchema.messages({
        'any.required': 'El ID del doctor es requerido.'
    }),
    date: dateOrDateObjectSchema.required().messages({
        'any.required': 'La fecha de la prescripción es requerida.'
    }),
    notes: notesSchema,
    status: Joi.string().valid('ACTIVE', 'FILLED', 'CANCELLED', 'EXPIRED').optional().allow(null, ''),
    payment_status: Joi.string().valid(...PAYMENT_STATUSES).optional().allow(null, ''),
    payment_amount: Joi.number().precision(2).min(0).optional().allow(null),
    payment_date: dateOrDateObjectSchema.optional().allow(null),
    medications: Joi.array().items(medicationItemSchema).optional().min(1).messages({
        'array.min': 'Debe incluir al menos un medicamento si se proporciona el campo "medications".'
    })
};

const createPrescriptionSchema = Joi.object(prescriptionBaseSchema);

const updatePrescriptionSchema = createUpdateSchema({
    patient_id: optionalPositiveIdSchema,
    doctor_id: optionalPositiveIdSchema,
    date: dateOrDateObjectSchema.optional(),
    notes: notesSchema,
    status: Joi.string().valid('ACTIVE', 'FILLED', 'CANCELLED', 'EXPIRED').optional().allow(null, ''),
    payment_status: Joi.string().valid(...PAYMENT_STATUSES).optional().allow(null, ''),
    payment_amount: Joi.number().precision(2).min(0).optional().allow(null),
    payment_date: dateOrDateObjectSchema.optional().allow(null),
    medications: Joi.array().items(medicationItemSchema).optional().min(1)
});

// Esquema para actualizar un medicamento específico
const updateMedicationInPrescriptionSchema = createUpdateSchema({
    medication_name: Joi.string().max(CHAR_LIMITS.MEDICATION).optional(),
    dose: Joi.string().max(CHAR_LIMITS.DOSE).optional().allow(null, ''),
    instructions: Joi.string().max(CHAR_LIMITS.INSTRUCTIONS).optional().allow(null, '')
});

module.exports = {
    createPrescriptionSchema,
    updatePrescriptionSchema,
    updateMedicationInPrescriptionSchema
};
