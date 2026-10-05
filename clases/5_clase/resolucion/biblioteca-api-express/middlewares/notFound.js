// Mounted after all routers: if it gets here, no route matched.
function notFound(req, res) {
  res.status(404).json({
    error: {
      code: "ROUTE_NOT_FOUND",
      message: `Route ${req.method} ${req.originalUrl} does not exist`,
    },
  });
}

export default notFound;
