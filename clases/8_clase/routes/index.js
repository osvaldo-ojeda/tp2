import { Router } from "express";
import createBooksRouter from "./booksRoutes.js";

/**
 * Router principal centralizado.
 * Recibe las dependencias de controladores necesarias y las propaga a los sub-routers.
 */
function createRouter(booksController) {
  const router = Router();

  // Montamos los routers de recursos
  router.use("/books", createBooksRouter(booksController));

  return router;
}

export default createRouter;
