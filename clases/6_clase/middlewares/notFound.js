import AppError from "../errors/AppError.js";

// Se ejecuta si ninguna ruta matcheó: deriva un AppError 404 al errorHandler
function notFound(req, res, next) {
  next(new AppError("ROUTE_NOT_FOUND", `Route ${req.method} ${req.originalUrl} does not exist`, 404));
}

export default notFound;
