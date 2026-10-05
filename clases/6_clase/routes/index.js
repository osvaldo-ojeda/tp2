import { Router } from "express";
import booksRoutes from "./booksRoutes.js";

const router = Router();

// Montamos todos los routers de recursos acá con su ruta base
router.use("/books", booksRoutes);

export default router;
