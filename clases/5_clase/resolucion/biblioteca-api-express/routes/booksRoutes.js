import express from "express";
import booksController from "../controllers/booksController.js";

const router = express.Router();

// Rutas sin el prefijo /books — lo agrega index.js al montar el router
router.get("/", booksController.listar);
router.get("/:id", booksController.obtener);
router.post("/", booksController.crear);
router.put("/:id", booksController.actualizar);
router.delete("/:id", booksController.eliminar);

export default router;
