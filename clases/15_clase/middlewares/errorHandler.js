import AppError from "../errors/AppError.js";

// Manejador centralizado de errores (middleware de 4 parámetros)
function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details && { details: err.details }),
      },
    });
  }

  console.error("Unhandled error:", err);
  res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Ocurrió un error inesperado en el servidor" },
  });
}

export default errorHandler;
