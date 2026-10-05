import AppError from "../errors/AppError.js";

// Middleware de 4 parámetros: Express lo reconoce como manejador de errores.
// SIEMPRE debe ir registrado al final de todo en index.js.
function errorHandler(err, req, res, next) {
  // Error esperado: se responde con su statusCode y formato estandarizado.
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details && { details: err.details }),
      },
    });
  }

  // Error inesperado (bug): log completo en consola y respuesta 500 genérica.
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" },
  });
}

export default errorHandler;
