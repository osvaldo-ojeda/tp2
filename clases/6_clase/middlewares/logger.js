// Application middleware: logs each request and passes control to next().
function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
}

export default logger;
