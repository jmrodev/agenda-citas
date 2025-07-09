const Joi = require('joi');

const addPatientHealthInsuranceSchema = Joi.object({
    insurance_id: Joi.number().integer().positive().required().messages({
        'any.required': 'El ID de la obra social es requerido.'
    }),
    member_number: Joi.string().max(50).optional().allow(null, ''),
    is_primary: Joi.boolean().optional()
});

const updatePatientHealthInsuranceSchema = Joi.object({
    // patient_id e insurance_id no se deberían cambiar aquí, se gestionan por el ID de la relación.
    member_number: Joi.string().max(50).optional().allow(null, ''),
    is_primary: Joi.boolean().optional()
}).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo (member_number o is_primary) para actualizar.'
});

// Para la ruta de establecer como primaria, el body solo necesita el ID de la obra social (insurance_id)
// ya que el patient_id viene de la ruta.
const setPrimaryPatientHealthInsuranceSchema = Joi.object({
    insurance_id: Joi.number().integer().positive().required().messages({
        'any.required': 'El ID de la obra social (insurance_id) es requerido en el body.'
    })
});

module.exports = {
    addPatientHealthInsuranceSchema,
    updatePatientHealthInsuranceSchema,
    setPrimaryPatientHealthInsuranceSchema
};
