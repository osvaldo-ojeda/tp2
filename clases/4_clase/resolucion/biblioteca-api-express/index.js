const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// Habilita req.body con JSON en los POST/PUT/PATCH.
// (Qué es app.use y por qué esto se llama "middleware": clase 5)
app.use(express.json());

// --------------------------------------------------------------------------
// Estado en memoria
// --------------------------------------------------------------------------
let libros = [
  { id: 1, isbn: "9780307474728", titulo: "Cien años de soledad", autor: "Gabriel García Márquez", stock: 3 },
  { id: 2, isbn: "9780345391803", titulo: "Guía del autoestopista galáctico", autor: "Douglas Adams", stock: 0 },
  { id: 3, isbn: "9780140449136", titulo: "La Odisea", autor: "Homero", stock: 5 },
  { id: 4, isbn: "9780061120084", titulo: "Matar a un ruiseñor", autor: "Harper Lee", stock: 2 },
  { id: 5, isbn: "9780393312838", titulo: "1984", autor: "George Orwell", stock: 1 },
];

// --------------------------------------------------------------------------
// Rutas del CRUD
// --------------------------------------------------------------------------

app.get("/", (req, res) => {
  res.json({ mensaje: "Biblioteca API con Express (Clase 4)" });
});

// GET /libros  — lista, con filtro opcional ?autor=...
app.get("/libros", (req, res) => {
  const { autor } = req.query;

  if (autor) {
    const termino = autor.toLowerCase();
    const filtrados = libros.filter((l) => l.autor.toLowerCase().includes(termino));
    return res.status(200).json(filtrados);
  }

  res.status(200).json(libros);
});

// GET /libros/:id  — uno solo
app.get("/libros/:id", (req, res) => {
  const id = Number(req.params.id);
  const libro = libros.find((l) => l.id === id);

  if (!libro) {
    return res.status(404).json({ error: "Libro no encontrado" });
  }

  res.status(200).json(libro);
});

// POST /libros  — crear
app.post("/libros", (req, res) => {
  const { titulo, autor, isbn, stock } = req.body;

  if (!titulo || !autor) {
    return res.status(400).json({ error: "El título y el autor son obligatorios" });
  }

  const ids = libros.map((l) => l.id);
  const nuevoLibro = {
    id: ids.length > 0 ? Math.max(...ids) + 1 : 1,
    isbn: isbn ?? "Sin ISBN",
    titulo,
    autor,
    stock: stock ?? 0,
  };

  libros.push(nuevoLibro);
  res.status(201).json(nuevoLibro);
});

// PUT /libros/:id  — reemplazar (mantiene el id original)
app.put("/libros/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = libros.findIndex((l) => l.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Libro no encontrado" });
  }

  libros[index] = { ...libros[index], ...req.body, id };
  res.status(200).json(libros[index]);
});

// DELETE /libros/:id  — borrar
app.delete("/libros/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = libros.findIndex((l) => l.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Libro no encontrado" });
  }

  libros.splice(index, 1);
  res.status(200).json({ mensaje: "Libro eliminado correctamente" });
});

// --------------------------------------------------------------------------
// Desafío opcional: PATCH (actualización parcial)
// --------------------------------------------------------------------------

// PATCH /libros/:id  — actualiza solo los campos enviados
app.patch("/libros/:id", (req, res) => {
  const id = Number(req.params.id);
  const libro = libros.find((l) => l.id === id);

  if (!libro) {
    return res.status(404).json({ error: "Libro no encontrado" });
  }

  Object.assign(libro, req.body, { id });
  res.status(200).json(libro);
});

// --------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});
