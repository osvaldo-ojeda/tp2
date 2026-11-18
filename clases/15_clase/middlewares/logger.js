// Middleware de aplicación: registra la petición y pasa el control al siguiente handler
function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
}

export default logger;
