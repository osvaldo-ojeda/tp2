import express from "express";

import logger from "./middlewares/logger.js";
import notFound from "./middlewares/notFound.js";
import booksRoutes from "./routes/booksRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales — el orden es el orden de ejecución
app.use(logger);
app.use(express.json());

// Rutas: el prefijo /books se pega acá, no en el router
app.use("/books", booksRoutes);

// Ninguna ruta matcheó → 404 con formato estandarizado
app.use(notFound);

app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});
