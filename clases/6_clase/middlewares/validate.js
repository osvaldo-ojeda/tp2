import AppError from "../errors/AppError.js";

// Factory: recibe un schema de Zod y devuelve un middleware para req.body.
// Si es válido, reemplaza req.body por los datos limpios (con defaults aplicados).
// Si no, arma el array de detalles y deriva la llamada al errorHandler.
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join(".") || "(root)",
        message: issue.message,
      }));
      return next(new AppError("VALIDATION_ERROR", "Invalid data", 400, details));
    }

    req.body = result.data;
    next();
  };
}

// Para req.query. En Express 5 req.query es de solo lectura,
// guardamos el resultado validado en req.pagination.
function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join(".") || "(root)",
        message: issue.message,
      }));
      return next(new AppError("VALIDATION_ERROR", "Invalid data", 400, details));
    }

    req.pagination = result.data;
    next();
  };
}

export default validate;
export { validateQuery };
