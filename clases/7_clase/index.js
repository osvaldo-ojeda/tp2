import express from "express";

import logger from "./middlewares/logger.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import router from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares globales
app.use(logger);
app.use(express.json());

// Router centralizado de la aplicación
app.use(router);

// Manejadores de cierre (404 Not Found y Error Handler global)
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});
