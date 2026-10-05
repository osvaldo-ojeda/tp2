import { Router } from "express";
import booksRoutes from "./booksRoutes.js";

const router = Router();

// Montamos los routers de recursos con su prefijo base
router.use("/books", booksRoutes);

export default router;
