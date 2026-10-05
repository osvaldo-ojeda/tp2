import express from "express";

import logger from "./middlewares/logger.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import router from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales — el orden es el orden de ejecución
app.use(logger);
app.use(express.json());

// Todas las rutas se gestionan desde routes/index.js
app.use(router);

// Cierre de la fila: primero el 404, después el manejador de errores
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});
