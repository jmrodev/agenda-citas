const Joi = require('joi');

const updateUserConfigSchema = Joi.object({
    session_timeout_minutes: Joi.number().integer().min(5).max(1440).optional() // Ejemplo: entre 5 min y 24 horas
    // Podrían añadirse más configuraciones aquí en el futuro
}).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar la configuración.'
});

module.exports = {
    updateUserConfigSchema
};
