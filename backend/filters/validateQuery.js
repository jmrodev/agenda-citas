function validateQuery(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      return res.status(400).json({ errors: error.details.map(d => d.message) });
    }
    req.query = value; // Normaliza los valores
    next();
  };
}

function validateBody(schema, options = { abortEarly: false, allowUnknown: false, stripUnknown: true }) {
  return (req, res, next) => {
    // El contexto puede ser útil para validaciones condicionales en Joi (ej. $isAdminEditing)
    const context = {
      userRole: req.user?.role, // Asumiendo que req.user está disponible después de authMiddleware
      // otros datos de contexto si son necesarios
    };
    const validationOptions = { ...options, context };

    const { error, value } = schema.validate(req.body, validationOptions);
    if (error) {
      return res.status(400).json({ errors: error.details.map(d => d.message) });
    }
    req.body = value; // Sobrescribe req.body con los valores validados y posiblemente transformados/limpiados por Joi
    next();
  };
}

module.exports = {
  validateQuery,
  validateBody
};