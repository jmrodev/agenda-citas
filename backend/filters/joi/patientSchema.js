const Joi = require('joi');

// Helper para validar fecha que puede ser string YYYY-MM-DD o objeto {day, month, year}
const dateOrDateObjectSchema = Joi.alternatives().try(
    Joi.string().isoDate().messages({ // Acepta 'YYYY-MM-DD'
        'string.isoDate': 'El formato de fecha debe ser YYYY-MM-DD.'
    }),
    Joi.object({
        day: Joi.number().integer().min(1).max(31).required(),
        month: Joi.number().integer().min(1).max(12).required(),
        year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required() // Año hasta el actual
    }).required()
).messages({
    'alternatives.types': 'La fecha debe ser una cadena YYYY-MM-DD o un objeto {day, month, year}.'
});

// Esquema para la persona de referencia (simplificado para anidar, o podríamos importar el completo)
const nestedReferencePersonSchema = Joi.object({
    name: Joi.string().min(2).max(100).optional().allow(null, ''),
    last_name: Joi.string().min(2).max(100).optional().allow(null, ''),
    phone: Joi.string().pattern(/^[0-9+\-\s()]*$/).max(30).optional().allow(null, ''),
    relationship: Joi.string().max(50).optional().allow(null, ''),
    address: Joi.string().max(255).optional().allow(null, '')
});

const patientBaseSchemaFields = {
    first_name: Joi.string().min(2).max(100).required().messages({
        'string.empty': 'El nombre es requerido.', 'any.required': 'El nombre es requerido.'
    }),
    last_name: Joi.string().min(2).max(100).required().messages({
        'string.empty': 'El apellido es requerido.', 'any.required': 'El apellido es requerido.'
    }),
    dni: Joi.string().alphanum().min(7).max(20).required().messages({ // DNI puede ser alfanumérico en algunos países
        'string.empty': 'El DNI es requerido.', 'any.required': 'El DNI es requerido.',
        'string.min': 'El DNI debe tener al menos 7 caracteres.', 'string.max': 'El DNI no puede exceder los 20 caracteres.'
    }),
    // El controlador usa 'birth_date' en el body y lo convierte a 'date_of_birth'
    // Así que validaremos 'birth_date' como entrada.
    birth_date: dateOrDateObjectSchema.required().messages({ // Renombrado a birth_date para el input
        'any.required': 'La fecha de nacimiento es requerida.'
    }),
    email: Joi.string().email().optional().allow(null, ''),
    phone: Joi.string().pattern(/^[0-9+\-\s()]*$/).max(30).optional().allow(null, ''),
    address: Joi.string().max(255).optional().allow(null, ''),
    health_insurance_id: Joi.number().integer().positive().optional().allow(null),
    health_insurance_member_number: Joi.string().max(50).optional().allow(null, ''),
    preferred_payment_methods: Joi.string().max(100).optional().allow(null, ''),
    doctor_ids: Joi.array().items(Joi.number().integer().positive()).optional().allow(null),
    reference_person: nestedReferencePersonSchema.optional().allow(null)
};

// Esquema para crear un paciente
const createPatientSchema = Joi.object(patientBaseSchemaFields)
    .when(Joi.object({ '$userRole': Joi.string().valid('secretary').required() }).unknown(), {
        then: Joi.object({
            doctor_ids: Joi.array().items(Joi.number().integer().positive()).min(1).required().messages({
                'array.min': 'Debe asignar al menos un doctor al paciente cuando crea como secretaria.',
                'any.required': 'La asignación de doctores es requerida para secretarias.'
            })
        })
    });


// Esquema para actualizar un paciente
const updatePatientSchema = Joi.object({
    first_name: Joi.string().min(2).max(100).optional(),
    last_name: Joi.string().min(2).max(100).optional(),
    dni: Joi.string().alphanum().min(7).max(20).optional(),
    birth_date: dateOrDateObjectSchema.optional(), // Renombrado a birth_date para el input
    email: Joi.string().email().optional().allow(null, ''),
    phone: Joi.string().pattern(/^[0-9+\-\s()]*$/).max(30).optional().allow(null, ''),
    address: Joi.string().max(255).optional().allow(null, ''),
    health_insurance_id: Joi.number().integer().positive().optional().allow(null),
    health_insurance_member_number: Joi.string().max(50).optional().allow(null, ''),
    preferred_payment_methods: Joi.string().max(100).optional().allow(null, ''),
    doctor_ids: Joi.array().items(Joi.number().integer().positive()).optional().allow(null),
    reference_person: nestedReferencePersonSchema.optional().allow(null)
}).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar el paciente.'
});

// Esquema para registrar paciente con usuario (usado en patientController.registerPatientWithUser)
// Este es un subconjunto de createPatientSchema + campos de usuario.
const registerPatientWithUserSchema = Joi.object({
    // Campos del paciente
    first_name: Joi.string().min(2).max(100).required(),
    last_name: Joi.string().min(2).max(100).required(),
    dni: Joi.string().alphanum().min(7).max(20).required(),
    birth_date: dateOrDateObjectSchema.required(), // Renombrado a birth_date
    email: Joi.string().email().required().messages({ // Email es requerido para el usuario
         'string.empty': 'El email es requerido para la cuenta de usuario.',
         'any.required': 'El email es requerido para la cuenta de usuario.'
    }),
    phone: Joi.string().pattern(/^[0-9+\-\s()]*$/).max(30).optional().allow(null, ''),
    address: Joi.string().max(255).optional().allow(null, ''),
    // Campos del usuario
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/).required().messages({
        'string.min': 'La contraseña debe tener al menos 8 caracteres.',
        'string.pattern.base': 'La contraseña debe contener al menos una mayúscula, una minúscula y un número.',
        'string.empty': 'La contraseña es requerida.',
        'any.required': 'La contraseña es requerida.'
    }),
    // Otros campos opcionales del paciente pueden ir aquí
    health_insurance_id: Joi.number().integer().positive().optional().allow(null),
    health_insurance_member_number: Joi.string().max(50).optional().allow(null, ''),
    preferred_payment_methods: Joi.string().max(100).optional().allow(null, ''),
    doctor_ids: Joi.array().items(Joi.number().integer().positive()).optional().allow(null),
});

// Esquema para actualizar datos del propio paciente (rol 'patient' en /me)
// Similar a updatePatientSchema pero podría tener menos campos permitidos si fuera necesario.
const updateMyPatientProfileSchema = updatePatientSchema; // Por ahora igual, se puede diferenciar después.


// Esquema para actualizar los doctores de un paciente
const updatePatientDoctorsSchema = Joi.object({
    doctor_ids: Joi.array().items(Joi.number().integer().positive()).min(1).required().messages({
        'array.min': 'Debe asignar al menos un doctor.',
        'any.required': 'La lista de IDs de doctores es requerida.'
    })
});


module.exports = {
    createPatientSchema,
    updatePatientSchema,
    registerPatientWithUserSchema,
    updateMyPatientProfileSchema,
    updatePatientDoctorsSchema
};
