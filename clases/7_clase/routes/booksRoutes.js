import express from "express";
import booksController from "../controllers/booksController.js";
import validate, { validateQuery, validateParams } from "../middlewares/validate.js";
import {
  createBookSchema,
  updateBookSchema,
  queryBooksSchema,
  bookIdParamSchema,
} from "../schemas/bookSchema.js";

const booksRoutes = express.Router();

// Definición de endpoints delegando a las funciones de la instancia de BooksController con validaciones
booksRoutes.get("/", validateQuery(queryBooksSchema), booksController.list);
booksRoutes.get("/:id", validateParams(bookIdParamSchema), booksController.get);
booksRoutes.post("/", validate(createBookSchema), booksController.create);
booksRoutes.put("/:id", validateParams(bookIdParamSchema), validate(updateBookSchema), booksController.update);
booksRoutes.delete("/:id", validateParams(bookIdParamSchema), booksController.remove);

export default booksRoutes;
