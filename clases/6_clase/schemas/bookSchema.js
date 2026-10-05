import { z } from "zod";

// Definimos los campos base reutilizables
const fields = {
  title: z.string({ error: "Title is required" }).min(1, "Title cannot be empty"),
  author: z.string({ error: "Author is required" }).min(1, "Author cannot be empty"),
  isbn: z.string().regex(/^\d{13}$/, "ISBN must be exactly 13 digits"),
  stock: z
    .number({ error: "Stock must be a number" })
    .int("Stock must be an integer")
    .nonnegative("Stock cannot be negative"),
};

// POST /books — title y author obligatorios, isbn opcional, stock con default 0
const createBookSchema = z.object({
  title: fields.title,
  author: fields.author,
  isbn: fields.isbn.optional(),
  stock: fields.stock.default(0),
});

// PUT /books/:id — actualización: todos los campos opcionales, stock SIN default
const updateBookSchema = z.object({
  title: fields.title.optional(),
  author: fields.author.optional(),
  isbn: fields.isbn.optional(),
  stock: fields.stock.optional(),
});

// Query params para listar (?page=&limit=) — llegan como strings (z.coerce)
const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export { createBookSchema, updateBookSchema, paginationSchema };
