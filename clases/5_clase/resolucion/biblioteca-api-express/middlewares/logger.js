// Middleware de aplicación: loguea cada request y sigue la fila con next().
function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
}

export default logger;
