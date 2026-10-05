// Error esperado de la aplicación: lleva código HTTP (statusCode), código de negocio (code) y detalles opcionales.
class AppError extends Error {
  constructor(code, message, statusCode = 400, details = undefined) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export default AppError;
