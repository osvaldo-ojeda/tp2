import AppError from "../errors/AppError.js";

// Middleware 404 para rutas inexistentes
function notFound(req, res, next) {
  next(new AppError("ROUTE_NOT_FOUND", `La ruta ${req.method} ${req.originalUrl} no existe`, 404));
}

export default notFound;
