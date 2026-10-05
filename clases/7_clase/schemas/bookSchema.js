import { z } from "zod";

// Definición de campos reutilizables
const fields = {
  titulo: z.string({ error: "El título es obligatorio" }).min(1, "El título no puede estar vacío"),
  autor: z.string({ error: "El autor es obligatorio" }).min(1, "El autor no puede estar vacío"),
  isbn: z.string().regex(/^\d{13}$/, "El ISBN debe tener exactamente 13 dígitos"),
  stock: z
    .number({ error: "El stock debe ser un número" })
    .int("El stock debe ser un número entero")
    .nonnegative("El stock no puede ser negativo"),
};

// Esquema para POST /books
const createBookSchema = z.object({
  titulo: fields.titulo,
  autor: fields.autor,
  isbn: fields.isbn.optional(),
  stock: fields.stock.default(0),
});

// Esquema para PUT /books/:id (actualización parcial)
const updateBookSchema = z.object({
  titulo: fields.titulo.optional(),
  autor: fields.autor.optional(),
  isbn: fields.isbn.optional(),
  stock: fields.stock.optional(),
});

// Esquema de paginación básica
const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// Esquema completo para req.query en GET /books (filtros, ordenamiento y paginación)
const queryBooksSchema = z.object({
  autor: z.string().optional(),
  author: z.string().optional(),
  isbn: z.string().optional(),
  sort: z.string().optional(),
  page: z.coerce.number().int("La página debe ser un entero").positive("La página debe ser mayor a 0").optional(),
  limit: z.coerce.number().int("El límite debe ser un entero").positive("El límite debe ser mayor a 0").max(100, "El límite máximo es 100").optional(),
});

// Esquema para validar los parámetros de la URL (ej: /books/:id)
const bookIdParamSchema = z.object({
  id: z.coerce.number().int("El ID debe ser un número entero").positive("El ID debe ser un número positivo"),
});

export {
  createBookSchema,
  updateBookSchema,
  paginationSchema,
  queryBooksSchema,
  bookIdParamSchema,
};
