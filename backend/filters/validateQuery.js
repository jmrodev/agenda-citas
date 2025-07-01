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

module.exports = validateQuery; 