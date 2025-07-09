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

const dateOrDateObjectOptionalSchema = dateOrDateObjectSchema.optional().allow(null);

// Esquema para un medicamento individual dentro de una prescripción
const medicationItemSchema = Joi.object({
    medication_name: Joi.string().max(255).required().messages({
        'string.empty': 'El nombre del medicamento es requerido.',
        'any.required': 'El nombre del medicamento es requerido.'
    }),
    dose: Joi.string().max(100).optional().allow(null, ''),
    instructions: Joi.string().max(500).optional().allow(null, '')
});

const prescriptionBaseSchema = {
    patient_id: Joi.number().integer().positive().required().messages({
        'any.required': 'El ID del paciente es requerido.'
    }),
    doctor_id: Joi.number().integer().positive().required().messages({
        'any.required': 'El ID del doctor es requerido.'
    }),
    date: dateOrDateObjectSchema.required().messages({ // El controlador espera 'date'
        'any.required': 'La fecha de la prescripción es requerida.'
    }),
    notes: Joi.string().max(1000).optional().allow(null, ''),
    status: Joi.string().valid('ACTIVE', 'FILLED', 'CANCELLED', 'EXPIRED').optional().allow(null, ''),

    // Campos de pago (si aplican a prescripciones)
    payment_status: Joi.string().valid('PENDING', 'PAID', 'PARTIAL', 'WAIVED').optional().allow(null, ''),
    payment_amount: Joi.number().precision(2).min(0).optional().allow(null),
    payment_date: dateOrDateObjectOptionalSchema,

    // Medicamentos: el controlador actual los maneja en endpoints separados,
    // pero un esquema de creación podría incluirlos.
    medications: Joi.array().items(medicationItemSchema).optional().min(1).messages({
        'array.min': 'Debe incluir al menos un medicamento si se proporciona el campo "medications".'
    })
};

const createPrescriptionSchema = Joi.object(prescriptionBaseSchema);

const updatePrescriptionSchema = Joi.object({
    patient_id: Joi.number().integer().positive().optional(), // Generalmente no se cambia
    doctor_id: Joi.number().integer().positive().optional(),   // Generalmente no se cambia
    date: dateOrDateObjectSchema.optional(),
    notes: Joi.string().max(1000).optional().allow(null, ''),
    status: Joi.string().valid('ACTIVE', 'FILLED', 'CANCELLED', 'EXPIRED').optional().allow(null, ''),
    payment_status: Joi.string().valid('PENDING', 'PAID', 'PARTIAL', 'WAIVED').optional().allow(null, ''),
    payment_amount: Joi.number().precision(2).min(0).optional().allow(null),
    payment_date: dateOrDateObjectOptionalSchema,
    medications: Joi.array().items(medicationItemSchema).optional().min(1)
}).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar la prescripción.'
});

// Esquema para actualizar un medicamento específico (usado en ruta anidada)
const updateMedicationInPrescriptionSchema = Joi.object({
    medication_name: Joi.string().max(255).optional(),
    dose: Joi.string().max(100).optional().allow(null, ''),
    instructions: Joi.string().max(500).optional().allow(null, '')
}).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar el medicamento.'
});


module.exports = {
    createPrescriptionSchema,
    updatePrescriptionSchema,
    // El schema para crear un medicamento individual es medicationItemSchema,
    // pero el endpoint actual /prescriptions/:id/medications no existe para POST.
    // Se usa updateMedicationInPrescriptionSchema para PUT en /prescriptions/:id/medications/:med_id
    updateMedicationInPrescriptionSchema
};
